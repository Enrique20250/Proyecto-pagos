import re
import hashlib
from datetime import datetime
import secrets

transacciones = []

def validar_tarjeta(numero):
    """Valida el número de tarjeta con algoritmo de Luhn"""
    numero_limpio = numero.replace(" ", "")
    if not re.match(r'^\d{13,19}$', numero_limpio):
        return False
    
    # Algoritmo de Luhn completo
    digitos = [int(d) for d in numero_limpio]
    checksum = 0
    for i, d in enumerate(reversed(digitos)):
        if i % 2 == 1:
            d = d * 2
            if d > 9:
                d = d - 9
        checksum += d
    return checksum % 10 == 0

def validar_fecha_vencimiento(fecha):
    """Valida que la fecha sea MM/YY y no esté vencida"""
    if not re.match(r'^\d{2}/\d{2}$', fecha):
        return False
    mes, año = map(int, fecha.split('/'))
    if mes < 1 or mes > 12:
        return False
    from datetime import datetime
    año_actual = datetime.now().year % 100
    if int(año) < año_actual:
        return False
    return True

def validar_cvv(cvv):
    """CVV debe ser 3-4 dígitos"""
    return bool(re.match(r'^\d{3,4}$', cvv))

def validar_monto(monto):
    """El monto debe ser positivo y dentro de límites razonables"""
    try:
        monto_float = float(monto)
        return monto_float > 0 and monto_float <= 999999.99
    except:
        return False

def generar_id_transaccion():
    """Genera un ID único para cada transacción"""
    return secrets.token_hex(8).upper()

def procesar_tarjeta(datos_tarjeta):
    """Procesa pago con tarjeta de crédito con validaciones completas"""
    numero = datos_tarjeta.get('numero', '').strip()
    fecha = datos_tarjeta.get('fecha', '').strip()
    cvv = datos_tarjeta.get('cvv', '').strip()
    monto = datos_tarjeta.get('monto', '')

    # Validaciones de seguridad
    if not validar_tarjeta(numero):
        return {"exito": False, "mensaje": "Número de tarjeta inválido o no pasa validación de Luhn"}
    
    if not validar_fecha_vencimiento(fecha):
        return {"exito": False, "mensaje": "Fecha de vencimiento inválida o vencida (formato MM/YY)"}
    
    if not validar_cvv(cvv):
        return {"exito": False, "mensaje": "CVV inválido (debe ser 3-4 dígitos)"}
    
    if not validar_monto(monto):
        return {"exito": False, "mensaje": "Monto inválido (0.01 a 999,999.99)"}

    transaccion = {
        "id": generar_id_transaccion(),
        "tipo": "Tarjeta de Crédito",
        "ultimos_digitos": numero.replace(" ", "")[-4:],
        "monto": float(monto),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "estado": "Completado",
        "detalles": f"Transacción con tarjeta exitosa"
    }
    transacciones.append(transaccion)
    
    return {"exito": True, "mensaje": "Pago con tarjeta procesado correctamente", "id_transaccion": transaccion["id"]}

def procesar_transferencia(datos_transferencia):
    """Procesa transferencia bancaria con validaciones completas"""
    banco = datos_transferencia.get('banco', '').strip()
    cuenta = datos_transferencia.get('cuenta', '').strip()
    monto = datos_transferencia.get('monto', '')

    # Validaciones de seguridad
    if not banco or len(banco) < 2:
        return {"exito": False, "mensaje": "Nombre de banco inválido"}
    
    if not re.match(r'^\d{10,20}$', cuenta):
        return {"exito": False, "mensaje": "Número de cuenta debe tener entre 10 y 20 dígitos"}
    
    if not validar_monto(monto):
        return {"exito": False, "mensaje": "Monto inválido (0.01 a 999,999.99)"}

    transaccion = {
        "id": generar_id_transaccion(),
        "tipo": "Transferencia Bancaria",
        "banco": banco,
        "ultimos_digitos": cuenta[-4:],
        "monto": float(monto),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "estado": "Completado",
        "detalles": f"Transferencia a {banco}"
    }
    transacciones.append(transaccion)
    
    return {"exito": True, "mensaje": "Transferencia procesada correctamente", "id_transaccion": transaccion["id"]}

def obtener_transacciones():
    """Retorna todas las transacciones registradas en orden inverso (más recientes primero)"""
    return sorted(transacciones, key=lambda x: x["timestamp"], reverse=True)

def obtener_estadisticas():
    """Retorna estadísticas generales del sistema"""
    total = len(transacciones)
    monto_total = sum(t["monto"] for t in transacciones)
    transacciones_exitosas = len([t for t in transacciones if t["estado"] == "Completado"])
    
    return {
        "total_transacciones": total,
        "monto_total": round(monto_total, 2),
        "transacciones_exitosas": transacciones_exitosas,
        "promedio_transaccion": round(monto_total / total, 2) if total > 0 else 0
    }
