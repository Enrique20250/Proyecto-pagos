const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


let usuarios = [
    { id: 1, nombre: "Carlos", correo: "carlos@gmail.com" },
    { id: 2, nombre: "Ana", correo: "ana@gmail.com" }
];

app.get('/usuarios', (req, res) => {
    console.log("Mostrando usuarios (simulación):");
    console.log(usuarios);

    res.json(usuarios);
});

app.post('/usuarios', (req, res) => {
    const { nombre, correo } = req.body;

    const nuevo = {
        id: usuarios.length + 1,
        nombre,
        correo
    };

    usuarios.push(nuevo);

    console.log("Usuario registrado (simulación):");
    console.log(nuevo);

    res.send("Usuario procesado correctamente (simulación)");
});

let pagos = [
    { id: 1, monto: 150.0, metodo: "Tarjeta" },
    { id: 2, monto: 300.0, metodo: "Transferencia" }
];

app.get("/pagos", (req, res) => {
    console.log("Mostrando pagos (simulación):");
    console.log(pagos);

    res.json(pagos);
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



app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
