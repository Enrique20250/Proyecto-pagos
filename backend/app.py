from flask import Flask
from routes.pagos import pagos_bp
from routes.tarjeta import tarjeta_bp
from routes.transferencia import transferencia_bp

app = Flask(__name__)
app.register_blueprint(pagos_bp)
app.register_blueprint(tarjeta_bp)
app.register_blueprint(transferencia_bp)
@app.route("/")
def inicio():
    return "API de Pagos lista"
if __name__ == "__main__":
    app.run(debug=True)
