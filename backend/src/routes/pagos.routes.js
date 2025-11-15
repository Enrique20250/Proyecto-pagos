
const express = require("express");
const router = express.Router();
const PagoController = require("../controllers/pagos.controller");

router.get("/pagos", PagoController.listarPagos);
router.post("/pagos", PagoController.registrarPago);
router.get("/pagos/:id", PagoController.detallePago);

module.exports = router;
