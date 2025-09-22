from conexion_bd import obtener_conexion

def insertar(consulta, parametros=None):
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute(consulta, parametros or())
    conexion.commit()
    cursor.close()
    conexion.close()
    return 'Datos insertados correctamente'

def consulta(consulta, parametros=None):
    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute(consulta,parametros or ())
    resultado = cursor.fetchall()
    conexion.close
    return resultado

def consulta_unica(consulta, parametros=None):
    conexion = obtener_conexion()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute(consulta,parametros or ())
    resultado = cursor.fetchone()
    conexion.close
    return resultado