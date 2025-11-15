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
});




