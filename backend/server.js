const express = require('express');
const app = express();
const PagoRouter = require("./routes/pagos.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/usuarios', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos del formulario (USUARIOS):");
    console.log(datos);

    res.send("Usuario procesado correctamente (simulación)");
});

app.use("/pagos", PagoRouter);

let servicios = [
    { nombre: "Mantenimiento", costo: 80, descripcion: "Servicio básico" }
];

app.get("/servicios", (req, res) => {
    console.log("Mostrando servicios (simulación)");
    res.send(servicios);
});

app.post("/servicios", (req, res) => {
    const { nombre, precio, descripcion } = req.body;

    console.log("Datos recibidos del formulario (SERVICIOS):");
    console.log(req.body);

    servicios.push({ nombre, precio, descripcion });

    res.send("Servicio procesado correctamente (simulación)");
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
