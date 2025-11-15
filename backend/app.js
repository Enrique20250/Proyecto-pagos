const express = require('express');
const app = express();
const PagoRouter = require("./routes/pagos.routes");

// Middleware para leer body de formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =====================================
   RUTAS DE USUARIOS
===================================== */

// POST /usuarios (desde formulario)
app.post('/usuarios', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos del formulario (USUARIOS):");
    console.log(datos);

    res.send("Usuario procesado correctamente (simulación)");
});

// GET /usuarios (desde navegador)
app.get("/usuarios", (req, res) => {
    res.send("Página de usuarios (GET funcionando)");
});

/* =====================================
   RUTAS DE PAGOS (con router externo)
===================================== */

app.use("/pagos", PagoRouter);

/* =====================================
   RUTAS DE SERVICIOS
===================================== */

// Lista inicial
let servicios = [
    { nombre: "Mantenimiento", precio: 80, descripcion: "Servicio básico" }
];

// GET /servicios (para navegador o listados HTML)
app.get("/servicios", (req, res) => {
    console.log("Mostrando servicios (simulación)");
    res.json(servicios); // <-- IMPORTANTE
});

// POST /servicios (desde formulario HTML)
app.post("/servicios", (req, res) => {
    const { nombre, precio, descripcion } = req.body;

    console.log("Datos recibidos del formulario (SERVICIOS):");
    console.log(req.body);

    servicios.push({ nombre, precio, descripcion });

    res.send("Servicio procesado correctamente (simulación)");
});

/* =====================================
   INICIAR SERVIDOR
===================================== */
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
