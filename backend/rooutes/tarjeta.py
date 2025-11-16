from flask import Blueprint, request, jsonify

tarjeta_bp = Blueprint('tarjeta', __name__)

@tarjeta_bp.route('/tarjeta', methods=['POST'])
def registrar_tarjeta():
    data = request.json
    return jsonify({"mensaje": "Tarjeta recibida", "data": data})
