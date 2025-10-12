
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

@app.route('/nosotros')
def nosotros():
    return render_template('nosotros.html')
 
#para que nadie entre a donde no lo llaman xd
def login_requerido(f):
    @wraps(f)
    def decorador(*args, **kwargs):
        if 'id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorador

@app.route('/organizador')
@login_requerido
def Organizador():
    usuario_id = session['id']
    
    query = 'SELECT * FROM tareas WHERE usuario_id = %s'
    tareas = consulta(query,(usuario_id,))
    return render_template('organizador.html', tareas=tareas)

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
        
@app.route('/diario')
@login_requerido
def diario():
    usuario_id = session['id']

    query = 'SELECT * FROM diario WHERE usuario_id = %s ORDER BY fecha DESC'
    diarios = consulta(query, (usuario_id,))
        
    return render_template('diario.html', diarios=diarios)

@app.route('/nuevo_dia/<int:id>')
def entradas_diario(id):
    query = 'SELECT * FROM diario WHERE id = %s'
    parametros = (id,)
    diarios = consulta(query, parametros)
    return render_template('nueva_entrada.html', diarios=diarios)
        
@app.route('/pomodoro')
def temporizador():
    return render_template('temporizador.html')

@app.route('/opiniones')
def opiniones():
    return render_template('opiniones.html')

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
    return render_template('opiniones.html', reseñas=reseñas)

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
            return redirect(url_for('diario'))
        else:
            mensaje = 'Usuario o contraseña incorrectos'
            return render_template('login.html', mensaje=mensaje,login=login)
    
    return render_template('login.html', login=True)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('inicio'))
    
app.run(debug=True)