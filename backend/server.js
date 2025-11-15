const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/usuarios', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos del formulario (USUARIOS):");
    console.log(datos);

    res.send("Usuario procesado correctamente (simulación)");
});


let pagos = [
    { cliente: "Carlos", monto: 120, fecha: "2025-01-01" }
];

let servicios = [
    { nombre: "Mantenimiento", costo: 80, descripcion: "Servicio básico" }
];

app.get("/pagos", (req, res) => {
    console.log("Mostrando pagos (simulación)");
    res.send(pagos);
});

app.post("/pagos", (req, res) => {
    const { cliente, monto, fecha } = req.body;

    console.log("Datos recibidos del formulario (PAGOS):");
    console.log(req.body);

    pagos.push({ cliente, monto, fecha });

    res.send("Pago procesado correctamente (simulación)");
});

app.get("/servicios", (req, res) => {
    console.log("Mostrando servicios (simulación)");
    res.send(servicios);
});

app.post("/servicios", (req, res) => {
    const { nombre, costo, descripcion } = req.body;

    console.log("Datos recibidos del formulario (SERVICIOS):");
    console.log(req.body);

    servicios.push({ nombre, costo, descripcion });

    res.send("Servicio procesado correctamente (simulación)");
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});


