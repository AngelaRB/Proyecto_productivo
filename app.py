from flask import Flask, render_template, request, redirect, url_for
from consultas import insertar, consulta, consulta_unica
from dotenv import load_dotenv
import os

load_dotenv()
 
app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY')
 

@app.route('/') 
def index(): 
    return render_template('index.html') 

@app.route('/diario')
def diario():
    return render_template('diario.html')

@app.route('/pomodoro')
def temporizador():
    return render_template('temporizador.html')

app.run(debug=True)