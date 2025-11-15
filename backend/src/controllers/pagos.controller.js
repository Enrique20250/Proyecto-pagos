const PagoService = require("../services/pagos.service");

class PagoController {

    static listarPagos(req, res) {
        const pagos = PagoService.obtenerPagos();
        res.json(pagos);
    }

    static registrarPago(req, res) {
        const { monto, metodo } = req.body;

        const resultado = PagoService.registrarPago(monto, metodo);

        res.json({
            mensaje: "Pago registrado",
            data: resultado
        });
    }

    static detallePago(req, res) {
        const id = req.params.id;
        const pago = PagoService.obtenerPagoPorId(id);

        if (!pago) {
            return res.status(404).json({ error: "Pago no encontrado" });
        }

        res.json(pago);
    }
}

module.exports = PagoController;
