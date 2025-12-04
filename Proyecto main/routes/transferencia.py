from flask import Blueprint, request
from controllers.pagos_controller import procesar_transferencia

transferencia_bp = Blueprint('transferencia', __name__)

@transferencia_bp.route('/transferir', methods=['POST'])
def transferir():
    datos = request.form
    return procesar_transferencia(datos)
