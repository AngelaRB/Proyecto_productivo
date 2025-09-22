import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

def obtener_conexion():
    try:
        conexion = mysql.connector.connect(
            host = os.getenv('DB_HOST'),
            database = os.getenv('DB_NAME'),
            user = os.getenv('DB_USER'),
            password = os.getenv('DB_PASSWORD'),
        )
        if conexion.is_connected():
            print("Conexion exitosa a la base de datos")
            return conexion
        else: 
            print("No se pudo establecer la conexión")
            return None
        
        
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None