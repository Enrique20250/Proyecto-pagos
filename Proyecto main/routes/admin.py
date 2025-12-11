from flask import Blueprint, render_template, jsonify, request
from flask_login import login_required, current_user
from models.transaction import Transaction, AuditLog
from models.user import User
from app import db

admin_bp = Blueprint('admin', __name__)

def es_admin(f):
    """Decorador para verificar si el usuario es admin"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return {"error": "Acceso denegado"}, 403
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard')
@login_required
@es_admin
def dashboard():
    """Panel de administrador"""
    return render_template('admin_dashboard.html')

@admin_bp.route('/api/estadisticas')
@login_required
@es_admin
def api_estadisticas():
    """Estadísticas del sistema para admin"""
    total_usuarios = User.query.count()
    total_transacciones = Transaction.query.count()
    monto_total = db.session.query(db.func.sum(Transaction.monto)).scalar() or 0
    
    return jsonify({
        "total_usuarios": total_usuarios,
        "total_transacciones": total_transacciones,
        "monto_total": round(monto_total, 2),
        "promedio_transaccion": round(monto_total / total_transacciones, 2) if total_transacciones > 0 else 0
    })

@admin_bp.route('/api/transacciones')
@login_required
@es_admin
def api_transacciones():
    """Lista todas las transacciones para admin"""
    transacciones = Transaction.query.all()
    return jsonify([{
        'id': t.id,
        'usuario': User.query.get(t.user_id).username,
        'tipo': t.tipo,
        'monto': t.monto,
        'estado': t.estado,
        'timestamp': t.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for t in transacciones])

@admin_bp.route('/api/auditoria')
@login_required
@es_admin
def api_auditoria():
    """Registros de auditoría para admin"""
    audits = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(100).all()
    return jsonify([{
        'usuario': User.query.get(a.user_id).username if a.user_id else 'Sistema',
        'accion': a.accion,
        'timestamp': a.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'ip': a.ip_address
    } for a in audits])
