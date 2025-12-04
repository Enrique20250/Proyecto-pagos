const btnActualizar = document.getElementById("btn-actualizar")
const btnLimpiar = document.getElementById("btn-limpiar")

btnActualizar.addEventListener("click", cargarTransacciones)

btnLimpiar.addEventListener("click", () => {
  if (confirm("¿Estás seguro de que quieres limpiar todo el historial? Esta acción no se puede deshacer.")) {
    fetch("/pagos/api/limpiar", { method: "POST" }).then(() => {
      cargarTransacciones()
      alert("Historial limpiado correctamente")
    })
  }
})

async function cargarTransacciones() {
  try {
    const res = await fetch("/pagos/api/transacciones")
    const transacciones = await res.json()

    const tablaBody = document.getElementById("tabla-transacciones")
    const sinTransacciones = document.getElementById("sin-transacciones")

    if (transacciones.length === 0) {
      sinTransacciones.classList.remove("hidden")
      tablaBody.innerHTML = ""
      actualizarEstadisticas([])
      return
    }

    sinTransacciones.classList.add("hidden")

    tablaBody.innerHTML = transacciones
      .map(
        (t) => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.tipo}</td>
                <td>
                    <small>${t.tipo === "Tarjeta de Crédito" ? "Tarjeta ****" + t.ultimos_digitos : "Banco: " + t.banco + " | Cuenta ****" + t.ultimos_digitos}</small>
                </td>
                <td><strong style="color: #10b981;">$${t.monto.toFixed(2)}</strong></td>
                <td><small>${t.timestamp}</small></td>
                <td><span class="status-badge success">${t.estado}</span></td>
            </tr>
        `,
      )
      .join("")

    actualizarEstadisticas(transacciones)
  } catch (error) {
    console.error("Error al cargar transacciones:", error)
  }
}

function actualizarEstadisticas(transacciones) {
  const totalTransacciones = transacciones.length
  const montoTotal = transacciones.reduce((sum, t) => sum + t.monto, 0)
  const transaccionesExitosas = transacciones.filter((t) => t.estado === "Completado").length
  const promedio = totalTransacciones > 0 ? montoTotal / totalTransacciones : 0

  document.getElementById("total-transacciones").textContent = totalTransacciones
  document.getElementById("monto-total").textContent = "$" + montoTotal.toFixed(2)
  document.getElementById("transacciones-exitosas").textContent = transaccionesExitosas
  document.getElementById("promedio-transaccion").textContent = "$" + promedio.toFixed(2)
}

// Cargar transacciones cuando se cargue la página
document.addEventListener("DOMContentLoaded", cargarTransacciones)

setInterval(cargarTransacciones, 3000)
