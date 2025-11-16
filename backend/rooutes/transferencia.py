from flask import Blueprint, request, jsonify

transferencia_bp = Blueprint('transferencia', __name__)

@transferencia_bp.route('/transferencia', methods=['POST'])
def hacer_transferencia():
    data = request.json
    return jsonify({"mensaje": "Transferencia realizada", "data": data})
