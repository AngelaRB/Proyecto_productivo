from flask import Flask, render_template, request, redirect, url_for, session
from consultas import insertar, consulta, consulta_unica
from dotenv import load_dotenv
import os
from datetime import datetime


load_dotenv()
 
app = Flask(__name__)

app.secret_key = "mi_clave_secreta"


 

@app.route('/')
def index():
    session["usuario"] = "Cristian"
    session["rol"] = "aprendiz"
    usuario = session.get("usuario")
    tipo_de_usuario = session.get("rol")
    return render_template('index.html', usuario=usuario, tipo_de_usuario=tipo_de_usuario)




@app.route('/index', methods=['POST'])
def tareas():
    if request.method == 'POST':
        tareas = request.form.get("tareas")

        query = ("INSERT INTO tareas (tareas) VALUES (%s)")
        parametros = (tareas)
        tarea = insertar(query,parametros)
    return redirect(url_for('index'))



@app.route('/agregar_nuevo_dia', methods=['POST', 'GET'])
def agregar_diario():
    if request.method == 'POST':
        titulo = request.form.get('titulo')
        fecha = request.form.get('fecha')
        descripcion = request.form.get('descripcion')
        
        query = ('INSERT INTO diario (titulo, fecha, descripcion) VALUES(%s,(NOW()),%s)')
        
        parametros = (titulo,descripcion)
        diario = insertar(query, parametros)
        
        return redirect(url_for('diario'))      
    
    return render_template('agregar_diario.html')
        
@app.route('/diario')
def diario():
    query = 'SELECT * FROM diario'
    diarios = consulta(query)
        
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
def reseñas():
    if request.method == 'POST':
        reseña = request.form.get('opinion')
        fecha = datetime.now()

        query = "INSERT INTO reseñas (texto, fecha) VALUES (%s, %s)"
        parametros = (reseña, fecha)
        insertar(query, parametros)

        # Redirige para mostrar la reseña recién agregada
        return redirect(url_for('reseñas'))

    # 👇 Aquí debe llamarse a la función, no a la función en sí
    reseñas = consulta("SELECT * FROM reseñas ORDER BY fecha DESC")

    # 👇 Pasa la variable al template
    return render_template('opiniones.html', reseñas=reseñas)




app.run(debug=True)