from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from consultas import insertar, consulta, consulta_unica
from dotenv import load_dotenv
import os
from datetime import date

load_dotenv()
 
app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY')


@app.route('/')
def inicio():
    return render_template('index.html')
 

@app.route('/toDo') 
def ToDo(): 
    return render_template('todo1.html') 

""""""
# Obtener todas las tareas
@app.route("/tasks", methods=["GET"])
def get_tasks():
    query = 'SELECT * FROM task'
    tasks = consulta_unica(query)
    
    return jsonify(tasks)



"""
# Agregar tarea

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    query = "INSERT INTO task (title, relevance) VALUES (%s, %s)"
    parametros = (data["title"], data["relevance"])
    tasks = insertar(query,parametros)
    
    return jsonify({"message": "Tarea agregada correctamente"})

# Editar tarea
@app.route("/tasks/<int:id>", methods=["PUT"])
def edit_task(id):
    data = request.json
    query = "UPDATE task SET title = %s, relevance = %s WHERE id = %s"
    parametros = (data["title"], data["relevance"], id)
    cursor = insertar(query,parametros)

    if cursor.rowcount > 0:
        return jsonify({"message": "Tarea actualizada"})
    return jsonify({"error": "Tarea no encontrada"}), 404

# Eliminar tarea
@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    query = "DELETE FROM task WHERE id = %s"
    cursor = insertar(query, (id,))
    
    if cursor.rowcount > 0:
        return jsonify({"message": "Tarea eliminada"})
    return jsonify({"error": "Tarea no encontrada"}), 404



#hasta acá va ToDo
"""


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

@app.route('/login', methods=['GET', 'POST'])
def login():
    mensaje = ''
    
    if request.method == 'POST':
        usuarios = request.form.get('usuarios')
        password = request.form.get('password')
        
        query = 'SELECT * FROM usuarios WHERE usuarios = %s and password = %s'
        parametros = (usuarios,password)
        user = consulta_unica(query,parametros)
        
        if usuarios == 'ange' and password == '8912':
            session['usuarios'] = user['id']
            session['usuarios'] = user['usuarios']
            return redirect(url_for('diario'))
        else:
            mensaje = 'Usuario o contraseña incorrectos'
            return render_template('login.html', mensaje=mensaje,login=login)
    
    return render_template('login.html', login=True)

app.run(debug=True)