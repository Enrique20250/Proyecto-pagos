const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// -----------------------------
//   SIMULACIÓN: USUARIOS
// -----------------------------
app.post('/usuarios', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos del formulario (USUARIOS):");
    console.log(datos);

    res.send("Usuario procesado correctamente (simulación)");
});

app.get('/usuarios', (req, res) => {
    res.send("Listado de usuarios (simulación)");
});

// -----------------------------
//   SIMULACIÓN: PAGOS
// -----------------------------
let pagos = [
    { id: 1, monto: 150.0, metodo: "Tarjeta" },
    { id: 2, monto: 300.0, metodo: "Transferencia" }
];

app.get("/pagos", (req, res) => {
    console.log("Mostrando pagos (simulación):");
    console.log(pagos);

    res.json(pagos); // <- igual que usuarios, pero muestra la lista
});

app.post("/pagos", (req, res) => {
    const { monto, metodo } = req.body;

    const nuevo = {
        id: pagos.length + 1,
        monto: parseFloat(monto),
        metodo
    };

    pagos.push(nuevo);

    console.log("Pago registrado (simulación):");
    console.log(nuevo);

    res.send("Pago procesado correctamente (simulación)");
});

// -----------------------------
//   SIMULACIÓN: SERVICIOS
// -----------------------------
let servicios = [
    { id: 1, nombre: "Mantenimiento", precio: 80, descripcion: "Servicio básico" }
];

app.get("/servicios", (req, res) => {
    console.log("Mostrando servicios (simulación):");
    console.log(servicios);

    res.json(servicios);
});

app.post("/servicios", (req, res) => {
    const { nombre, precio, descripcion } = req.body;

    const nuevo = {
        id: servicios.length + 1,
        nombre,
        precio,
        descripcion
    };

    servicios.push(nuevo);

    console.log("Servicio registrado (simulación):");
    console.log(nuevo);

    res.send("Servicio procesado correctamente (simulación)");
});

// -----------------------------
//   SERVIDOR
// -----------------------------
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
