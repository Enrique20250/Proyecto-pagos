let pagos = [
    { id: 1, monto: 150.0, metodo: "Tarjeta" },
    { id: 2, monto: 300.0, metodo: "Transferencia" }
];

class PagoService {

    static obtenerPagos() {
        return pagos;
    }

    static registrarPago(monto, metodo) {
        const nuevo = {
            id: pagos.length + 1,
            monto: parseFloat(monto),
            metodo
        };

        pagos.push(nuevo);

        return nuevo;
    }

    static obtenerPagoPorId(id) {
        return pagos.find(p => p.id == id);
    }
}

module.exports = PagoService;
