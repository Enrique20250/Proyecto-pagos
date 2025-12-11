"""
SISTEMA DE PAGOS - APLICACIÓN PRINCIPAL
======================================
Este archivo es el punto de entrada de la aplicación Flask.
Aquí se configuran las rutas principales y la API para procesar pagos.
"""

from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json
import os
from pathlib import Path

# Crear la aplicación Flask
app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'clave-segura-2025'

# Archivo JSON donde se guardan las transacciones
DATOS_FILE = 'datos_transacciones.json'


# ===== FUNCIONES AUXILIARES PARA GUARDAR/CARGAR DATOS =====

def cargar_transacciones():
    """
    Carga todas las transacciones desde el archivo JSON
    Retorna una lista vacía si el archivo no existe
    """
    if os.path.exists(DATOS_FILE):
        try:
            with open(DATOS_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []


def guardar_transacciones(transacciones):
    """
    Guarda la lista de transacciones en el archivo JSON
    Parámetro: transacciones (lista de diccionarios)
    """
    with open(DATOS_FILE, 'w') as f:
        json.dump(transacciones, f, indent=2)


# ===== RUTAS DE PÁGINAS HTML =====

@app.route('/')
def index():
    """Página de inicio - Muestra información del sistema"""
    return render_template('index.html')


@app.route('/pagos/pagar')
def pagar():
    """Página con el formulario para realizar pagos"""
    return render_template('pagar.html')


@app.route('/pagos/historial')
def historial():
    """Página con el historial de transacciones realizadas"""
    transacciones = cargar_transacciones()
    
    # Calcular estadísticas
    total = sum(t['monto'] for t in transacciones)
    promedio = total / len(transacciones) if transacciones else 0
    
    return render_template('historial.html', 
                         transacciones=transacciones,
                         total_transacciones=len(transacciones),
                         monto_total=total,
                         promedio=promedio)


# ===== APIs PARA PROCESAR PAGOS =====

@app.route('/api/procesar-pago', methods=['POST'])
def procesar_pago():
    """
    API para procesar un pago
    Recibe JSON con los datos del pago (método, tarjeta/cuenta, monto)
    Retorna JSON con el resultado: éxito o error
    """
    # Importar funciones de validación
    from controllers.pagos_controller import (
        validar_tarjeta, 
        validar_fecha_vencimiento, 
        validar_cvv, 
        validar_monto, 
        generar_id_transaccion
    )
    
    # Obtener los datos enviados desde el formulario
    datos = request.json
    metodo = datos.get('metodo')
    
    # ===== PROCESAR PAGO CON TARJETA =====
    if metodo == 'tarjeta':
        numero = datos.get('numero', '').replace(' ', '')
        fecha = datos.get('fecha', '')
        cvv = datos.get('cvv', '')
        monto = datos.get('monto', '')
        
        # Validar que la tarjeta sea válida (algoritmo de Luhn)
        if not validar_tarjeta(numero):
            return jsonify({'exito': False, 'mensaje': 'Número de tarjeta inválido'}), 400
        
        # Validar que la fecha no esté vencida
        if not validar_fecha_vencimiento(fecha):
            return jsonify({'exito': False, 'mensaje': 'Fecha de vencimiento inválida o vencida'}), 400
        
        # Validar CVV (3-4 dígitos)
        if not validar_cvv(cvv):
            return jsonify({'exito': False, 'mensaje': 'CVV inválido'}), 400
        
        # Validar monto positivo
        if not validar_monto(monto):
            return jsonify({'exito': False, 'mensaje': 'Monto inválido'}), 400
        
        # Generar ID único para esta transacción
        id_trans = generar_id_transaccion()
        
        # Cargar transacciones anteriores
        transacciones = cargar_transacciones()
        
        # Agregar nueva transacción (solo guardamos últimos 4 dígitos por seguridad)
        transacciones.append({
            'id': id_trans,
            'metodo': 'Tarjeta de Crédito',
            'ultimos_digitos': numero[-4:],  # Solo los últimos 4 dígitos
            'monto': float(monto),
            'estado': 'Exitosa',
            'timestamp': datetime.now().isoformat(),
            'detalles': f'Tarjeta terminada en {numero[-4:]}'
        })
        
        # Guardar las transacciones actualizadas
        guardar_transacciones(transacciones)
        
        # Retornar respuesta exitosa
        return jsonify({
            'exito': True,
            'mensaje': 'Pago procesado correctamente',
            'id_transaccion': id_trans,
            'monto': float(monto)
        })
    
    # ===== PROCESAR PAGO CON TRANSFERENCIA =====
    elif metodo == 'transferencia':
        import re
        
        banco = datos.get('banco', '').strip()
        cuenta = datos.get('cuenta', '').strip()
        monto = datos.get('monto', '')
        
        # Validar que el banco tenga al menos 2 caracteres
        if not banco or len(banco) < 2:
            return jsonify({'exito': False, 'mensaje': 'Banco inválido'}), 400
        
        # Validar que la cuenta tenga 10-20 dígitos
        if not re.match(r'^\d{10,20}$', cuenta):
            return jsonify({'exito': False, 'mensaje': 'Número de cuenta inválido (10-20 dígitos)'}), 400
        
        # Validar monto positivo
        if not validar_monto(monto):
            return jsonify({'exito': False, 'mensaje': 'Monto inválido'}), 400
        
        # Generar ID único para esta transacción
        id_trans = generar_id_transaccion()
        
        # Cargar transacciones anteriores
        transacciones = cargar_transacciones()
        
        # Agregar nueva transacción (solo guardamos últimos 4 dígitos por seguridad)
        transacciones.append({
            'id': id_trans,
            'metodo': 'Transferencia Bancaria',
            'ultimos_digitos': cuenta[-4:],  # Solo los últimos 4 dígitos
            'monto': float(monto),
            'estado': 'Exitosa',
            'timestamp': datetime.now().isoformat(),
            'detalles': f'Transferencia a {banco}'
        })
        
        # Guardar las transacciones actualizadas
        guardar_transacciones(transacciones)
        
        # Retornar respuesta exitosa
        return jsonify({
            'exito': True,
            'mensaje': 'Transferencia procesada correctamente',
            'id_transaccion': id_trans,
            'monto': float(monto)
        })
    
    # Si el método no es válido
    return jsonify({'exito': False, 'mensaje': 'Método inválido'}), 400


@app.route('/api/transacciones')
def obtener_transacciones():
    """API para obtener todas las transacciones en formato JSON"""
    transacciones = cargar_transacciones()
    return jsonify(transacciones)


@app.route('/api/limpiar-historial', methods=['POST'])
def limpiar_historial():
    """API para limpiar todo el historial de transacciones"""
    guardar_transacciones([])
    return jsonify({'exito': True, 'mensaje': 'Historial limpiado'})


# ===== EJECUTAR LA APLICACIÓN =====
if __name__ == '__main__':
    app.run(debug=True)
