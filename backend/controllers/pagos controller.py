"""
CONTROLADOR DE PAGOS - FUNCIONES DE VALIDACIÓN
=============================================
Este archivo contiene todas las funciones de validación para pagos.
Cada función valida un aspecto diferente de la información financiera.
"""

import re
from datetime import datetime
import secrets


# ===== VALIDACIÓN DE TARJETA DE CRÉDITO =====

def validar_tarjeta(numero):
    """
    Valida que el número de tarjeta sea correcto usando el Algoritmo de Luhn.
    
    El Algoritmo de Luhn es un método estándar de la industria para validar
    números de tarjeta de crédito. Funciona así:
    
    1. Multiplica cada segundo dígito (de derecha a izquierda) por 2
    2. Si el resultado es mayor a 9, resta 9
    3. Suma todos los dígitos
    4. El número es válido si la suma es divisible entre 10
    
    Parámetro: numero (string) - número de tarjeta con o sin espacios
    Retorna: True si es válido, False si no
    """
    # Limpiar espacios y validar que solo tenga dígitos
    numero_limpio = numero.replace(" ", "")
    if not re.match(r'^\d{13,19}$', numero_limpio):
        return False
    
    # Convertir cada carácter en número
    digitos = [int(d) for d in numero_limpio]
    checksum = 0
    
    # Recorrer los dígitos de derecha a izquierda
    for i, d in enumerate(reversed(digitos)):
        # Si es un dígito par (contando de derecha a izquierda), multiplicar por 2
        if i % 2 == 1:
            d = d * 2
            # Si el resultado es mayor a 9, restar 9
            if d > 9:
                d = d - 9
        checksum += d
    
    # Retornar True si la suma es divisible entre 10
    return checksum % 10 == 0


# ===== VALIDACIÓN DE FECHA DE VENCIMIENTO =====

def validar_fecha_vencimiento(fecha):
    """
    Valida que la fecha de vencimiento sea válida y no esté vencida.
    
    La fecha debe estar en formato MM/YY (Mes/Año de 2 dígitos)
    Ejemplos válidos: 12/26, 03/25
    
    Parámetro: fecha (string) - en formato MM/YY
    Retorna: True si es válida, False si no
    """
    # Validar que tenga el formato MM/YY
    if not re.match(r'^\d{2}/\d{2}$', fecha):
        return False
    
    # Separar mes y año
    mes, año = map(int, fecha.split('/'))
    
    # Validar que el mes sea 1-12
    if mes < 1 or mes > 12:
        return False
    
    # Obtener el año actual (últimos 2 dígitos)
    año_actual = datetime.now().year % 100
    
    # Validar que la tarjeta no esté vencida
    if int(año) < año_actual:
        return False
    
    return True


# ===== VALIDACIÓN DE CVV =====

def validar_cvv(cvv):
    """
    Valida que el CVV (Código de Seguridad) sea válido.
    
    El CVV debe ser 3 dígitos (Visa y MasterCard) o 4 dígitos (American Express)
    
    Parámetro: cvv (string) - código de seguridad
    Retorna: True si es válido, False si no
    """
    return bool(re.match(r'^\d{3,4}$', cvv))


# ===== VALIDACIÓN DE MONTO =====

def validar_monto(monto):
    """
    Valida que el monto sea un número positivo dentro de límites razonables.
    
    El monto debe estar entre $0.01 y $999,999.99
    
    Parámetro: monto (string o número) - cantidad a pagar
    Retorna: True si es válido, False si no
    """
    try:
        monto_float = float(monto)
        # Verificar que esté en el rango permitido
        return 0.01 <= monto_float <= 999999.99
    except:
        # Si no se puede convertir a número, es inválido
        return False


# ===== GENERACIÓN DE ID DE TRANSACCIÓN =====

def generar_id_transaccion():
    """
    Genera un ID único para cada transacción.
    
    El ID tiene el formato: TRX + 8 caracteres hexadecimales aleatorios
    Ejemplo: TRX4A7F9C2B
    
    Retorna: string con el ID único
    """
    # secrets es un módulo seguro para generar números aleatorios
    return 'TRX' + secrets.token_hex(4).upper()
