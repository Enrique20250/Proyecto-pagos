from flask import Blueprint, request
from controllers.pagos_controller import procesar_tarjeta

tarjeta_bp = Blueprint('tarjeta', __name__)

@tarjeta_bp.route('/pagar_tarjeta', methods=['POST'])
def pagar_tarjeta():
    datos = request.form
    return procesar_tarjeta(datos)
