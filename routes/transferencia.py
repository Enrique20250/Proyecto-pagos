"""
RUTA ESPECIALIZADA PARA TRANSFERENCIAS BANCARIAS
=================================================
Este archivo maneja específicamente las transferencias bancarias.
Similar a tarjeta.py, muestra cómo organizar rutas especializadas.
"""

from flask import Blueprint, request, jsonify
from controllers.pagos_controller import procesar_transferencia

# Crear blueprint para rutas de transferencia
# El prefijo 'transferencia' agrupa todas las rutas de transferencias
transferencia_bp = Blueprint('transferencia', __name__, prefix='transferencia')

# Ruta para procesar transferencia bancaria
@transferencia_bp.route('/realizar', methods=['POST'])
def realizar_transferencia():
    """
    Ruta: POST /transferencia/realizar
    
    Procesa una transferencia bancaria.
    
    Espera recibir JSON con:
    - banco: nombre del banco destino
    - cuenta: número de cuenta destino
    - monto: cantidad a transferir
    
    Retorna JSON con resultado (éxito o error)
    """
    datos = request.get_json()
    resultado = procesar_transferencia(datos)
    return jsonify(resultado)
