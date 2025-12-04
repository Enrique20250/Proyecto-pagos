from flask import Flask, render_template
from routes.pagos import pagos_bp
from routes.transferencia import transferencia_bp
from routes.tarjeta import tarjeta_bp

app = Flask(__name__, template_folder='templates')

app.register_blueprint(pagos_bp, url_prefix="/pagos")
app.register_blueprint(transferencia_bp, url_prefix="/transferencia")
app.register_blueprint(tarjeta_bp, url_prefix="/tarjeta")

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
