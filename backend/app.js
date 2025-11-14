const express = require("express");
const app = express();
const pagoRoutes = require("./src/routes/pagos.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", pagoRoutes);

app.listen(3000, () => {
    console.log("Servidor iniciado en http://localhost:3000");
});
