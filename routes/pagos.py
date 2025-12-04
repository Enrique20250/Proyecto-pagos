from flask import Blueprint, request, render_template, jsonify
from controllers.pagos_controller import (
    procesar_tarjeta, 
    procesar_transferencia, 
    obtener_transacciones,
    obtener_estadisticas,
    transacciones  # Importar para poder limpiar
)

pagos_bp = Blueprint('pagos', __name__, url_prefix='/pagos')

@pagos_bp.route('/pagar', methods=['GET'])
def mostrar_formulario():
    return render_template('pagar.html')

@pagos_bp.route('/realizar', methods=['POST'])
def realizar_pago():
    """Procesa un pago según el método seleccionado"""
    datos = request.get_json()
    metodo = datos.get('metodo')

    if metodo == 'tarjeta':
        resultado = procesar_tarjeta(datos)
    elif metodo == 'transferencia':
        resultado = procesar_transferencia(datos)
    else:
        resultado = {"exito": False, "mensaje": "Método de pago no soportado"}

    return jsonify(resultado)

@pagos_bp.route('/historial', methods=['GET'])
def historial():
    """Muestra el historial de transacciones"""
    return render_template('historial.html')

@pagos_bp.route('/api/transacciones', methods=['GET'])
def api_transacciones():
    """API que retorna todas las transacciones"""
    return jsonify(obtener_transacciones())

@pagos_bp.route('/api/limpiar', methods=['POST'])
def limpiar_historial():
    """Limpia el historial de transacciones"""
    transacciones.clear()
    return jsonify({"exito": True, "mensaje": "Historial limpiado"})

@pagos_bp.route('/api/estadisticas', methods=['GET'])
def api_estadisticas():
    """API que retorna estadísticas del sistema"""
    return jsonify(obtener_estadisticas())
