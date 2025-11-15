const express = require("express");
const router = express.Router();
const PagoController = require("../controllers/pagos.controller");

router.get("/", PagoController.listarPagos);
router.post("/", PagoController.registrarPago);
router.get("/:id", PagoController.detallePago);

module.exports = router;
