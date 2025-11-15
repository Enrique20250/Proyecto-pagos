const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Servidor funcionando");
});

app.post('/guardarUsuario', (req, res) => {
    const datos = req.body;

    console.log("Datos recibidos:", datos);

    res.send("Usuario recibido y procesado (simulación)");
});

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});
