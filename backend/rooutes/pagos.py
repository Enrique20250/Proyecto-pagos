from flask import Blueprint, request, render_template, jsonify
from controllers.pagos_controller import procesar_tarjeta, procesar_transferencia

pagos_bp = Blueprint('pagos', __name__, url_prefix='/pagos')

@pagos_bp.route('/pagar', methods=['GET'])
def mostrar_formulario():
    return render_template('pagar.html')

@pagos_bp.route('/realizar', methods=['POST'])
def realizar_pago():
    datos = request.get_json()
    metodo = datos.get('metodo')

    if metodo == 'tarjeta':
        mensaje = procesar_tarjeta(datos)
    elif metodo == 'transferencia':
        mensaje = procesar_transferencia(datos)
    else:
        mensaje = "Método de pago no soportado"

    return jsonify({"mensaje": mensaje})
