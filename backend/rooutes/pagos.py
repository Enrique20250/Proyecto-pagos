from flask import Blueprint, request
from controllers.pagos_controller import procesar_pago

pagos_bp = Blueprint("pagos", __name__, url_prefix="/pagos")
@pagos_bp.post("/realizar")
def realizar_pago():
    datos = request.json
    respuesta = procesar_pago(datos)
    return respuesta
