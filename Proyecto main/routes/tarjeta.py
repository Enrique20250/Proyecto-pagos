"""
RUTA ESPECIALIZADA PARA PAGOS CON TARJETA
==========================================
Este archivo maneja específicamente los pagos por tarjeta de crédito.
Aunque en el proyecto actual se usa la ruta principal, esto muestra
cómo se podría organizar con rutas especializadas.
"""

from flask import Blueprint, request, jsonify
from controllers.pagos_controller import procesar_tarjeta

# Crear blueprint para rutas de tarjeta
# El prefijo 'tarjeta' agrupa todas las rutas relacionadas con tarjetas
tarjeta_bp = Blueprint('tarjeta', __name__, prefix='tarjeta')

# Ruta para procesar pago con tarjeta
@tarjeta_bp.route('/pagar', methods=['POST'])
def pagar_con_tarjeta():
    """
    Ruta: POST /tarjeta/pagar
    
    Procesa un pago cuando el usuario elige método de tarjeta.
    
    Espera recibir JSON con:
    - numero: número de tarjeta
    - fecha: fecha de vencimiento (MM/YY)
    - cvv: código de seguridad
    - monto: cantidad a pagar
    
    Retorna JSON con resultado (éxito o error)
    """
    datos = request.get_json()
    resultado = procesar_tarjeta(datos)
    return jsonify(resultado)
