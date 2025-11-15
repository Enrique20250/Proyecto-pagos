document.getElementById("formPago").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
        monto: document.getElementById("monto").value,
        metodo: document.getElementById("metodo").value
    };
    const res = await fetch("http://localhost:5000/pagos/realizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
    const json = await res.json();
    console.log(json);
});
