def procesar_tarjeta(datos_tarjeta):

    numero = datos_tarjeta.get('numero')
    fecha = datos_tarjeta.get('fecha')
    cvv = datos_tarjeta.get('cvv')

    if numero and fecha and cvv:
        return "Pago con tarjeta procesado correctamente"
    return "Error en datos de tarjeta"

def procesar_transferencia(datos_transferencia):

    banco = datos_transferencia.get('banco')
    cuenta = datos_transferencia.get('cuenta')
    monto = datos_transferencia.get('monto')

    if banco and cuenta and monto:
        return "Transferencia procesada correctamente"
    return "Error en datos de transferencia"
