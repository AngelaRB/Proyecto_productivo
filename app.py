
from flask import Flask, render_template, request, redirect, url_for, jsonify, session, flash
from flask_bcrypt import bcrypt
from consultas import insertar, consulta, consulta_unica
from dotenv import load_dotenv
from functools import wraps
import os
from datetime import datetime


load_dotenv()
 
app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY')


@app.route('/')
def inicio():
    return render_template('index.html', index=True)

# Login, register, logout, login requerido y admin requerido

@app.route('/register', methods=['GET', 'POST'])
def register():
    mensaje = ''
    
    if request.method == 'POST':
        usuario = request.form.get('usuarios')
        password = request.form.get('password')
        
        # verifica si es mismo usuario
        query = 'SELECT * FROM usuarios where usuario = %s'
        existe = consulta_unica(query, (usuario,))
        print("Valor de existe:", existe)
        
        if existe:
            mensaje = 'Usuario existente, elige otro.'
            return render_template('register.html', mensaje=mensaje, register=register)

        hash_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        query = 'INSERT INTO usuarios (usuario, password) VALUES (%s, %s)'
        parametros = (usuario, hash_pw.decode('utf-8'))
        insertar(query, parametros)
        
        mensaje = 'Usuario registrado con éxito'
        return redirect(url_for('login'))
    
    return render_template('register.html', mensaje=mensaje, register=True)

@app.route('/login', methods=['GET', 'POST'])
def login():
    mensaje = ''
    
    if request.method == 'POST':
        usuario = request.form.get('usuarios')
        password = request.form.get('password')
        
        query = 'SELECT * FROM usuarios WHERE usuario = %s'
        parametros = (usuario,)
        user = consulta_unica(query,parametros)
        
        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['id'] = user['id']
            session['usuario'] = user['usuario']
            session['rol'] = user['rol']
            print("ROL DEL USUARIO:", user.get('rol'))

            return redirect(url_for('diario'))
        else:
            mensaje = 'Usuario o contraseña incorrectos'
            return render_template('login.html', mensaje=mensaje,login=login)
    
    return render_template('login.html', login=True)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('inicio'))

#para que nadie entre a donde no lo llaman xd
def login_requerido(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        if 'id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorador

def admin_requerido(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        if 'id' not in session:
            return redirect(url_for('login'))
        
        if session.get('rol') != 'admin':
            return redirect(url_for('diario'))
        
        return f(*args, **kwargs)
    return decorador

# hasta aquí login

# panel admin

@app.route('/admin')
@admin_requerido
def admin():
    return render_template('admin.html', admin=True, pagina_actual='admin')

@app.route('/contacto')
def contacto():
    return render_template('contacto.html')

@app.route('/contactar', methods=['POST', 'GET']) # inserta contactos en tabla
def contactar():
    nombre = request.form.get('nombre')
    correo = request.form.get('correo')
    mensaje = request.form.get('mensaje')
    
    query = ('INSERT INTO contacto (nombre, correo, mensaje) VALUES(%s,%s,%s)')
    parametros = (nombre,correo,mensaje)
    insertar(query,parametros)
    
    return redirect(url_for('tabla_contacto'))

@app.route('/tabla_contacto') # muestra los datos pal admin
@admin_requerido
def tabla_contacto():
    query = 'SELECT * FROM contacto'
    contacto = consulta(query)
    return render_template('tabla_contacto.html', contactos=contacto)

@app.route('/tabla_usuarios', methods=['POST', 'GET'])
def tabla_usuarios():
    query = 'SELECT * FROM usuarios'
    usuarios = consulta(query)
    return render_template('tabla_usuarios.html', usuarios=usuarios)
    
@app.route('/nosotros')
def nosotros():
    return render_template('nosotros.html')



@app.route('/organizador')
@login_requerido
def Organizador():
    usuario_id = session['id']
    
    query = 'SELECT * FROM tareas WHERE usuario_id = %s'
    tareas = consulta(query,(usuario_id,))
    return render_template('organizador.html', tareas=tareas, pagina_actual='organizador')

@app.route('/agregar_tarea', methods=['POST'])
def agregar_tarea():
    titulo = request.form.get('titulo')
    usuario_id = session['id']

    if titulo:
        query = "INSERT INTO tareas (tarea, hecha, usuario_id) VALUES (%s, %s,%s)"
        parametros = (titulo,False, usuario_id)
        insertar(query, parametros)

    return redirect(url_for('Organizador'))

@app.route('/eliminar_tarea/<int:id>', methods=['POST'])
def eliminar_tarea(id):
    query = "DELETE FROM tareas WHERE id = %s"
    insertar(query, (id,))
    return redirect(url_for('Organizador'))

@app.route('/marcar_hecha/<int:id>', methods=['POST'])
def marcar_hecha(id):
    query = "UPDATE tareas SET hecha = NOT hecha WHERE id = %s"
    insertar(query, (id,))
    return redirect(url_for('Organizador'))

@app.route('/diario')
@login_requerido
def diario():
    usuario_id = session['id']

    query = 'SELECT * FROM diario WHERE usuario_id = %s ORDER BY fecha DESC'
    diarios = consulta(query, (usuario_id,))
        
    return render_template('diario.html', diarios=diarios, pagina_actual='diario')

@app.route('/agregar_nuevo_dia', methods=['POST', 'GET'])
@login_requerido
def agregar_diario():
    if request.method == 'POST':
        titulo = request.form.get('titulo')
        descripcion = request.form.get('descripcion')
        usuario_id = session['id']
        
        query = ('INSERT INTO diario (titulo, descripcion, usuario_id) VALUES(%s,%s,%s)')
        
        parametros = (titulo,descripcion,usuario_id)
        diario = insertar(query, parametros)
        
        return redirect(url_for('diario'))
    
    return render_template('agregar_diario.html')

@app.route('/ver_diario/<int:id>')
def entradas_diario(id):
    usuario_id = session.get('id')
    if not usuario_id:
        return redirect(url_for('diario'))
    
    
    query = 'SELECT * FROM diario WHERE id = %s AND usuario_id = %s'
    parametros = (id, usuario_id)
    diario = consulta_unica(query, parametros)
    print(diario)
    
    if not diario:
        return redirect(url_for('diario'))
    
    return render_template('ver_entrada.html', diario=diario)

@app.route('/verificar_password/<int:id>', methods=['POST'])
def verificar_password(id):
    data = request.get_json()
    password = data.get('password')

    usuario = session.get('usuario')

    # Corregimos el query (ya no es una tupla)
    query = 'SELECT password FROM usuarios WHERE usuario = %s'
    usuario_data = consulta_unica(query, (usuario,))

    if usuario_data and bcrypt.checkpw(password.encode('utf-8'), usuario_data['password'].encode('utf-8')):
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

        
@app.route('/pomodoro')
def temporizador():
    return render_template('temporizador.html', pagina_actual='pomodoro')

"""
@app.route('/opiniones')
def opiniones():
    return render_template('opiniones.html', )"""

@app.route('/reseñas', methods=['GET', 'POST'])
@login_requerido
def reseñas():
    if request.method == 'POST':
        reseña = request.form.get('opinion')
        fecha = datetime.now()
        estrellas_str = request.form.get("estrellas")
        estrellas = float(estrellas_str) if estrellas_str else 0.0
        query = "INSERT INTO reseñas (texto, fecha, estrellas) VALUES (%s, %s, %s)"
        parametros = (reseña, fecha, estrellas)
        insertar(query, parametros)

        # Redirige para mostrar la reseña recién agregada
        return redirect(url_for('reseñas'))

    # 👇 Aquí debe llamarse a la función, no a la función en sí
    reseñas = consulta("SELECT * FROM reseñas ORDER BY fecha DESC")

    # 👇 Pasa la variable al template
    return render_template('opiniones.html', reseñas=reseñas, pagina_actual='opiniones')

@app.route('/relax', methods=['GET', 'POST'])
@login_requerido
def relax():
    return render_template('relax.html', pagina_actual='relax')


    
app.run(debug=True)