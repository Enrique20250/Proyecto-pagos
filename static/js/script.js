const formPago = document.getElementById("formPago")
const metodoSelect = document.getElementById("metodo")
const camposTarjeta = document.getElementById("campos-tarjeta")
const camposTransferencia = document.getElementById("campos-transferencia")
const resultadoDiv = document.getElementById("resultado")

const numeroInput = document.getElementById("numero")
const fechaInput = document.getElementById("fecha")
const cvvInput = document.getElementById("cvv")
const cuentaInput = document.getElementById("cuenta")
const montoInput = document.getElementById("monto")

// Mostrar/ocultar campos según método seleccionado
metodoSelect.addEventListener("change", (e) => {
  const metodo = e.target.value

  if (metodo === "tarjeta") {
    camposTarjeta.classList.remove("hidden")
    camposTransferencia.classList.add("hidden")
    limpiarErrores()
  } else if (metodo === "transferencia") {
    camposTarjeta.classList.add("hidden")
    camposTransferencia.classList.remove("hidden")
    limpiarErrores()
  } else {
    camposTarjeta.classList.add("hidden")
    camposTransferencia.classList.add("hidden")
  }
})

// Formatear número de tarjeta
numeroInput.addEventListener("input", (e) => {
  const value = e.target.value.replace(/\s/g, "")
  const formatted = value.match(/.{1,4}/g)?.join(" ") || value
  e.target.value = formatted.substring(0, 19)

  if (value.length >= 13) {
    const isValid = validarLuhn(value)
    if (isValid) {
      e.target.style.borderColor = "#10b981"
    } else {
      e.target.style.borderColor = "#ef4444"
    }
  }
})

// Formatear fecha de vencimiento
fechaInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "")
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4)
  }
  e.target.value = value.substring(0, 5)
})

// Solo números en CVV
cvvInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4)
})

// Solo números en cuenta
cuentaInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "")
})

// Validar monto
montoInput.addEventListener("input", (e) => {
  if (e.target.value < 0) {
    e.target.value = 0
  }
})

function validarLuhn(numero) {
  const digitos = numero.replace(/\D/g, "").split("").map(Number)
  let checksum = 0

  for (let i = digitos.length - 1; i >= 0; i--) {
    let d = digitos[i]
    if ((digitos.length - i) % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    checksum += d
  }

  return checksum % 10 === 0
}

function limpiarErrores() {
  document.querySelectorAll(".error-text").forEach((el) => {
    el.classList.remove("show")
    el.textContent = ""
  })
  if (numeroInput) numeroInput.style.borderColor = ""
  if (fechaInput) fechaInput.style.borderColor = ""
  if (cvvInput) cvvInput.style.borderColor = ""
  if (cuentaInput) cuentaInput.style.borderColor = ""
}

function mostrarError(campo, mensaje) {
  const errorEl = document.getElementById(`error-${campo}`)
  if (errorEl) {
    errorEl.textContent = mensaje
    errorEl.classList.add("show")
  }
}

// Enviar formulario
formPago.addEventListener("submit", async (e) => {
  e.preventDefault()
  limpiarErrores()

  const metodo = metodoSelect.value

  if (!metodo) {
    mostrarError("metodo", "Selecciona un método de pago")
    return
  }

  const datos = {
    metodo: metodo,
    monto: document.getElementById("monto").value,
  }

  if (metodo === "tarjeta") {
    datos.numero = document.getElementById("numero").value
    datos.fecha = document.getElementById("fecha").value
    datos.cvv = document.getElementById("cvv").value
  } else if (metodo === "transferencia") {
    datos.banco = document.getElementById("banco").value
    datos.cuenta = document.getElementById("cuenta").value
  }

  try {
    const res = await fetch("/pagos/realizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    })

    const json = await res.json()

    resultadoDiv.classList.remove("hidden")

    if (json.exito) {
      resultadoDiv.classList.remove("error")
      resultadoDiv.classList.add("success")
      resultadoDiv.innerHTML = `
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">✓ ${json.mensaje}</div>
                <div>ID de Transacción: <strong>#${json.id_transaccion}</strong></div>
            `
      formPago.reset()
      camposTarjeta.classList.add("hidden")
      camposTransferencia.classList.add("hidden")
    } else {
      resultadoDiv.classList.remove("success")
      resultadoDiv.classList.add("error")
      resultadoDiv.innerHTML = `<div style="font-size: 1.2rem;">✗ ${json.mensaje}</div>`
    }
  } catch (error) {
    resultadoDiv.classList.add("error")
    resultadoDiv.classList.remove("success")
    resultadoDiv.innerHTML = `<div>Error: ${error.message}</div>`
  }
})
