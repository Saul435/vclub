from flask import Flask
from flask_cors import CORS
from models.tipo_articulo import TipoArticulo
from routes.tipo_articulo_routes import tipo_articulo_bp
from models.genero import Genero
from routes.genero_routes import genero_bp
from models.cliente import Cliente
from routes.cliente_routes import cliente_bp
from models.empleado import Empleado
from routes.empleado_routes import empleado_bp
from models.idioma import Idioma
from routes.idioma_routes import idioma_bp
from models.elenco import Elenco
from routes.elenco_routes import elenco_bp
from models.usuario import Usuario
from routes.usuario_routes import usuario_bp
from models.descripcion_articulo import ( DescripcionArticulo )
from routes.descripcion_articulo_routes import ( descripcion_articulo_bp )

from database import db, DATABASE_URI

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)

db.init_app(app)
app.register_blueprint(tipo_articulo_bp)
app.register_blueprint(genero_bp)
app.register_blueprint(cliente_bp)
app.register_blueprint(empleado_bp)
app.register_blueprint(descripcion_articulo_bp)
app.register_blueprint(idioma_bp)
app.register_blueprint(elenco_bp)
app.register_blueprint(usuario_bp)


with app.app_context():
    db.create_all()


with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return {
        "message": "Sistema Video Club API funcionando"
    }

if __name__ == "__main__":
    app.run(debug=True)
