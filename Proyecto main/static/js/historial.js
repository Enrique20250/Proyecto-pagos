/**
 * SCRIPT PARA GESTIONAR EL HISTORIAL DE TRANSACCIONES
 * ===================================================
 * Este archivo maneja todo lo relacionado con la página de historial:
 * - Cargar transacciones desde el servidor
 * - Mostrarlas en una tabla
 * - Actualizar estadísticas
 * - Limpiar el historial
 */

// ===== OBTENER ELEMENTOS DEL DOM =====

// Botones de acción
const btnActualizar = document.getElementById("btn-actualizar")
const btnLimpiar = document.getElementById("btn-limpiar")

// Contenedores para datos
const tablaBody = document.getElementById("tabla-transacciones")
const sinTransacciones = document.getElementById("sin-transacciones")

// Elementos de estadísticas
const totalTransaccionesEl = document.getElementById("total-transacciones")
const montoTotalEl = document.getElementById("monto-total")
const transaccionesExitosasEl = document.getElementById("transacciones-exitosas")
const promedioTransaccionEl = document.getElementById("promedio-transaccion")

// ===== EVENT LISTENERS (qué hacer cuando se hace clic) =====

// Cuando hace clic en "Actualizar", recargar transacciones
btnActualizar.addEventListener("click", cargarTransacciones)

// Cuando hace clic en "Limpiar", pedir confirmación y borrar
btnLimpiar.addEventListener("click", () => {
  // Pedir confirmación al usuario (para evitar que borre sin querer)
  if (confirm("¿Estás seguro? Esta acción no se puede deshacer.")) {
    // Enviar petición POST al servidor para limpiar
    fetch("/pagos/api/limpiar-historial", { method: "POST" }).then(() => {
      // Recargar la tabla vacía
      cargarTransacciones()
      // Mostrar mensaje de éxito
      alert("Historial limpiado correctamente")
    })
  }
})

// ===== FUNCIÓN PRINCIPAL: CARGAR TRANSACCIONES =====

/**
 * Función que:
 * 1. Obtiene las transacciones del servidor
 * 2. Las muestra en la tabla
 * 3. Actualiza las estadísticas
 */
async function cargarTransacciones() {
  try {
    // Hacer petición GET al servidor para obtener transacciones
    const res = await fetch("/pagos/api/transacciones")
    const transacciones = await res.json()

    // Si no hay transacciones
    if (transacciones.length === 0) {
      // Mostrar el mensaje "Sin transacciones"
      sinTransacciones.classList.remove("hidden")
      // Vaciar la tabla
      tablaBody.innerHTML = ""
      // Resetear estadísticas a 0
      actualizarEstadisticas([])
      return
    }

    // Si hay transacciones, ocultar el mensaje "Sin transacciones"
    sinTransacciones.classList.add("hidden")

    // Crear las filas de la tabla dinámicamente
    tablaBody.innerHTML = transacciones
      .map((t) => {
        // Convertir el timestamp a fecha legible
        const fecha = new Date(t.timestamp).toLocaleString("es-ES")

        // Crear una fila de la tabla para cada transacción
        return `
                    <tr>
                        <td><strong>${t.id}</strong></td>
                        <td>${t.metodo}</td>
                        <td><small>${t.detalles}</small></td>
                        <td><strong style="color: #10b981;">$${t.monto.toFixed(2)}</strong></td>
                        <td><small>${fecha}</small></td>
                        <td><span class="status-badge success">${t.estado}</span></td>
                    </tr>
                `
      })
      .join("")

    // Actualizar las tarjetas de estadísticas
    actualizarEstadisticas(transacciones)
  } catch (error) {
    // Si hay un error en la conexión, mostrarlo en la consola
    console.error("Error al cargar transacciones:", error)
  }
}

// ===== FUNCIÓN: ACTUALIZAR ESTADÍSTICAS =====

/**
 * Actualiza los números en las 4 tarjetas de estadísticas
 * Parámetro: transacciones (array de transacciones)
 */
function actualizarEstadisticas(transacciones) {
  // Contar cantidad total de transacciones
  const totalTransacciones = transacciones.length

  // Sumar todos los montos
  const montoTotal = transacciones.reduce((sum, t) => sum + t.monto, 0)

  // Contar cuántas fueron exitosas
  const transaccionesExitosas = transacciones.filter((t) => t.estado === "Exitosa").length

  // Calcular promedio (monto total / cantidad de transacciones)
  const promedio = totalTransacciones > 0 ? montoTotal / totalTransacciones : 0

  // Actualizar los elementos en la página
  totalTransaccionesEl.textContent = totalTransacciones
  montoTotalEl.textContent = "$" + montoTotal.toFixed(2)
  transaccionesExitosasEl.textContent = transaccionesExitosas
  promedioTransaccionEl.textContent = "$" + promedio.toFixed(2)
}

// ===== INICIAR AL CARGAR LA PÁGINA =====

// Cuando termina de cargar el HTML, ejecutar cargarTransacciones
document.addEventListener("DOMContentLoaded", cargarTransacciones)
