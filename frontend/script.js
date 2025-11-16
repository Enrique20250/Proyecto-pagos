document.getElementById("formPago").addEventListener("submit", async (e) => { 
    e.preventDefault();  

    const datos = {
        metodo: document.getElementById("metodo").value,
        numero: document.querySelector('input[name="numero"]').value,
        fecha: document.querySelector('input[name="fecha"]').value,
        cvv: document.querySelector('input[name="cvv"]').value,
        banco: document.querySelector('input[name="banco"]').value,
        cuenta: document.querySelector('input[name="cuenta"]').value,
        monto: document.getElementById("monto").value
    };

    const res = await fetch("/pagos/realizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const json = await res.json();
    document.getElementById("resultado").innerText = json.mensaje;
});
