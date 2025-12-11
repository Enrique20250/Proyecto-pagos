"""
RUTAS PRINCIPALES DEL SISTEMA DE PAGOS
========================================
Este archivo define todas las rutas (URLs) principales de la aplicación.
Cada ruta maneja una solicitud diferente del usuario.
"""

from flask import Blueprint, render_template, request, jsonify
from datetime import datetime
import json
import os

# Crear un "blueprint" (grupo de rutas) para pagos
# El prefijo '/pagos' significa que todas las rutas empezarán con /pagos
pagos_bp = Blueprint('pagos', __name__, url_prefix='/pagos')

# Importar funciones de validación desde el controlador
from controllers.pagos_controller import (
    validar_tarjeta,
    validar_fecha_vencimiento,
    validar_cvv,
    validar_monto,
    generar_id_transaccion
)

# Archivo donde se guardan las transacciones
DATOS_FILE = 'datos_transacciones.json'


# ===== FUNCIONES AUXILIARES PARA MANEJAR DATOS =====

def cargar_transacciones():
    """Carga las transacciones guardadas desde el archivo JSON"""
    if os.path.exists(DATOS_FILE):
        try:
            with open(DATOS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []


def guardar_transacciones(transacciones):
    """Guarda las transacciones en el archivo JSON"""
    with open(DATOS_FILE, 'w') as f:
        json.dump(transacciones, f, indent=2)


# ===== RUTA: MOSTRAR FORMULARIO DE PAGO =====

@pagos_bp.route('/pagar', methods=['GET'])
def mostrar_formulario():
    """
    Ruta: GET /pagos/pagar
    
    Cuando el usuario accede a /pagos/pagar, esta función se ejecuta.
    Simplemente muestra el archivo HTML con el formulario de pago.
    """
    return render_template('pagar.html')


# ===== RUTA: MOSTRAR HISTORIAL =====

@pagos_bp.route('/historial', methods=['GET'])
def historial():
    """
    Ruta: GET /pagos/historial
    
    Muestra la página con todas las transacciones realizadas.
    También calcula estadísticas para mostrar en el dashboard.
    """
    transacciones = cargar_transacciones()
    
    # Calcular estadísticas
    total_monto = sum(t['monto'] for t in transacciones)
    total_transacciones = len(transacciones)
    promedio = total_monto / total_transacciones if transacciones else 0
    
    return render_template('historial.html',
                         transacciones=transacciones,
                         total_transacciones=total_transacciones,
                         monto_total=total_monto,
                         promedio=promedio)


# ===== RUTA: API PARA OBTENER TRANSACCIONES EN JSON =====

@pagos_bp.route('/api/transacciones', methods=['GET'])
def obtener_transacciones():
    """
    Ruta: GET /pagos/api/transacciones
    
    Retorna todas las transacciones en formato JSON.
    Se usa desde JavaScript para actualizar la tabla sin recargar la página.
    """
    transacciones = cargar_transacciones()
    return jsonify(transacciones)


# ===== RUTA: API PARA LIMPIAR HISTORIAL =====

@pagos_bp.route('/api/limpiar-historial', methods=['POST'])
def limpiar_historial():
    """
    Ruta: POST /pagos/api/limpiar-historial
    
    Elimina todas las transacciones guardadas.
    Se protege con confirmación en el frontend para evitar accidentes.
    """
    guardar_transacciones([])
    return jsonify({
        'exito': True,
        'mensaje': 'Historial limpiado correctamente'
    })
