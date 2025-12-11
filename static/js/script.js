/**
 * SCRIPT PARA VALIDACIONES EN TIEMPO REAL DEL FORMULARIO
 * =====================================================
 * Este archivo maneja todas las validaciones mientras el usuario escribe.
 * Muestra errores inmediatamente y no permite enviar datos inválidos.
 */

// ===== OBTENER ELEMENTOS DEL DOM (componentes HTML) =====

const formPago = document.getElementById("formPago")
const metodoSelect = document.getElementById("metodo")
const camposTarjeta = document.getElementById("campos-tarjeta")
const camposTransferencia = document.getElementById("campos-transferencia")
const resultadoDiv = document.getElementById("resultado")

// Campos de tarjeta
const numeroInput = document.getElementById("numero")
const fechaInput = document.getElementById("fecha")
const cvvInput = document.getElementById("cvv")

// Campos de transferencia
const bancoInput = document.getElementById("banco")
const cuentaInput = document.getElementById("cuenta")

// Campo común
const montoInput = document.getElementById("monto")

// ===== CAMBIAR ENTRE MÉTODOS DE PAGO =====

/**
 * Cuando el usuario selecciona un método de pago diferente,
 * mostrar u ocultar los campos correspondientes
 */
metodoSelect.addEventListener("change", (e) => {
  const metodo = e.target.value

  if (metodo === "tarjeta") {
    // Si selecciona tarjeta: mostrar campos de tarjeta, ocultar transferencia
    camposTarjeta.classList.remove("hidden")
    camposTransferencia.classList.add("hidden")
    limpiarErrores()
  } else if (metodo === "transferencia") {
    // Si selecciona transferencia: mostrar transferencia, ocultar tarjeta
    camposTarjeta.classList.add("hidden")
    camposTransferencia.classList.remove("hidden")
    limpiarErrores()
  } else {
    // Si no selecciona nada, ocultar ambos
    camposTarjeta.classList.add("hidden")
    camposTransferencia.classList.add("hidden")
  }
})

// ===== VALIDACIONES EN TIEMPO REAL MIENTRAS SE ESCRIBE =====

/**
 * Formatear número de tarjeta: agregar espacios cada 4 dígitos
 * Entrada: 4532015112830366
 * Salida: 4532 0151 1283 0366
 */
numeroInput.addEventListener("input", (e) => {
  // Quitar todos los espacios
  const value = e.target.value.replace(/\s/g, "")

  // Agrupar cada 4 dígitos con espacios
  const formatted = value.match(/.{1,4}/g)?.join(" ") || value

  // Limitar a máximo 19 caracteres (16 dígitos + 3 espacios)
  e.target.value = formatted.substring(0, 19)

  // Validar con Luhn si ya tiene 13+ dígitos
  if (value.length >= 13) {
    const isValid = validarLuhn(value)
    // Cambiar color del borde: verde si es válido, rojo si no
    e.target.style.borderColor = isValid ? "#10b981" : "#ef4444"
  }
})

/**
 * Formatear fecha: convertir 122625 en 12/26
 */
fechaInput.addEventListener("input", (e) => {
  // Quitar caracteres que no sean números
  let value = e.target.value.replace(/\D/g, "")

  // Si tiene 2 o más dígitos, agregar barra
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4)
  }

  // Limitar a máximo 5 caracteres (MM/YY)
  e.target.value = value.substring(0, 5)
})

/**
 * CVV: solo números, máximo 4 dígitos
 */
cvvInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4)
})

/**
 * Número de cuenta: solo números
 */
cuentaInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "")
})

/**
 * Monto: no puede ser negativo
 */
montoInput.addEventListener("input", (e) => {
  if (e.target.value < 0) {
    e.target.value = 0
  }
})

// ===== ALGORITMO DE LUHN (VALIDACIÓN DE TARJETA) =====

/**
 * Valida un número de tarjeta usando el Algoritmo de Luhn
 *
 * ¿Cómo funciona?
 * 1. Toma cada segundo dígito de derecha a izquierda y multiplica por 2
 * 2. Si el resultado es > 9, resta 9
 * 3. Suma todos los dígitos
 * 4. Si la suma es divisible entre 10, el número es válido
 *
 * Parámetro: numero (string) - número de tarjeta
 * Retorna: true si es válido, false si no
 */
function validarLuhn(numero) {
  // Convertir string a array de números
  const digitos = numero.replace(/\D/g, "").split("").map(Number)
  let checksum = 0

  // Recorrer de derecha a izquierda
  for (let i = digitos.length - 1; i >= 0; i--) {
    let d = digitos[i]

    // Si es un dígito en posición par (contando de derecha a izquierda)
    if ((digitos.length - i) % 2 === 0) {
      d *= 2
      // Si el resultado es > 9, restar 9
      if (d > 9) d -= 9
    }

    checksum += d
  }

  return checksum % 10 === 0
}

// ===== MANEJO DE ERRORES =====

/**
 * Limpiar todos los mensajes de error de la página
 */
function limpiarErrores() {
  // Quitar todos los mensajes de error
  document.querySelectorAll(".error-text").forEach((el) => {
    el.classList.remove("show")
    el.textContent = ""
  })

  // Quitar colores de borde
  if (numeroInput) numeroInput.style.borderColor = ""
  if (fechaInput) fechaInput.style.borderColor = ""
  if (cvvInput) cvvInput.style.borderColor = ""
  if (cuentaInput) cuentaInput.style.borderColor = ""
}

/**
 * Mostrar un mensaje de error bajo un campo específico
 */
function mostrarError(campo, mensaje) {
  const errorEl = document.getElementById(`error-${campo}`)
  if (errorEl) {
    errorEl.textContent = mensaje
    errorEl.classList.add("show")
  }
}

// ===== ENVÍO DEL FORMULARIO =====

/**
 * Cuando el usuario hace clic en "Procesar Pago"
 * Validar todos los datos y enviar al servidor
 */
formPago.addEventListener("submit", async (e) => {
  e.preventDefault() // Evitar que la página se recargue
  limpiarErrores() // Limpiar errores anteriores

  const metodo = metodoSelect.value

  // Validar que haya seleccionado un método
  if (!metodo) {
    mostrarError("metodo", "Selecciona un método de pago")
    return
  }

  // Crear objeto con los datos a enviar
  const datos = {
    metodo: metodo,
    monto: document.getElementById("monto").value,
  }

  // Si es pago con tarjeta, agregar esos datos
  if (metodo === "tarjeta") {
    datos.numero = document.getElementById("numero").value
    datos.fecha = document.getElementById("fecha").value
    datos.cvv = document.getElementById("cvv").value
  }
  // Si es transferencia, agregar esos datos
  else if (metodo === "transferencia") {
    datos.banco = document.getElementById("banco").value
    datos.cuenta = document.getElementById("cuenta").value
  }

  try {
    // Enviar datos al servidor
    const res = await fetch("/api/procesar-pago", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })

    // Esperar respuesta del servidor
    const json = await res.json()

    // Mostrar el resultado
    resultadoDiv.classList.remove("hidden")

    if (json.exito) {
      // Pago exitoso - mostrar en verde
      resultadoDiv.classList.remove("error")
      resultadoDiv.classList.add("success")
      resultadoDiv.innerHTML = `
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">✓ ${json.mensaje}</div>
                <div>ID de Transacción: <strong>#${json.id_transaccion}</strong></div>
                <div>Monto: <strong>$${json.monto.toFixed(2)}</strong></div>
            `

      // Limpiar formulario
      formPago.reset()
      camposTarjeta.classList.add("hidden")
      camposTransferencia.classList.add("hidden")

      // Redirigir al historial después de 2 segundos
      setTimeout(() => {
        window.location.href = "/pagos/historial"
      }, 2000)
    } else {
      // Pago fallido - mostrar en rojo
      resultadoDiv.classList.remove("success")
      resultadoDiv.classList.add("error")
      resultadoDiv.innerHTML = `<div style="font-size: 1.2rem;">✗ ${json.mensaje}</div>`
    }
  } catch (error) {
    // Error de conexión
    resultadoDiv.classList.add("error")
    resultadoDiv.classList.remove("success")
    resultadoDiv.innerHTML = `<div>Error: ${error.message}</div>`
  }
})
