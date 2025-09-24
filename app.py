from flask import Flask, render_template, request, redirect, url_for
from consultas import insertar, consulta, consulta_unica
from dotenv import load_dotenv
import os
from datetime import date

load_dotenv()
 
app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY')
 

@app.route('/') 
def index(): 
    return render_template('index.html') 



@app.route('/agregar_nuevo_dia', methods=['POST', 'GET'])
def agregar_diario():
    if request.method == 'POST':
        titulo = request.form.get('titulo')
        fecha = request.form.get('fecha')
        descripcion = request.form.get('descripcion')
        
        query = ('INSERT INTO diario (titulo,fecha,descripcion) VALUES(%s,%s,%s)')
        parametros = (titulo,fecha,descripcion)
        diario = insertar(query,parametros)
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

app.run(debug=True)