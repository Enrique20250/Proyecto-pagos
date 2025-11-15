const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/usuarios', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos del formulario:");
    console.log(datos);  

    res.send("Usuario procesado correctamente (simulación)");
});


app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");

let servicios = [
    { nombre: "Mantenimiento PC", descripcion: "Limpieza y optimización", precio: 50 }
];

app.get('/servicios', (req, res) => {
    console.log("Mostrando servicios...");
    res.send(servicios); // Simulación
});

app.post('/servicios', (req, res) => {
    const { nombre, descripcion, precio } = req.body;

    console.log("Datos recibidos:", req.body);

    // Simulación de guardado
    servicios.push({ nombre, descripcion, precio });

    res.send("Servicio procesado correctamente (simulación)");
});

});




