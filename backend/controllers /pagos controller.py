def procesar_pago(datos):
    monto = datos.get("monto")
    metodo = datos.get("metodo")
    return {
        "mensaje": "Pago procesado correctamente",
        "monto": monto,
        "metodo": metodo
    }
