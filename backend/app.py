from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from database import db, DATABASE_URI

from os import getenv

from models.tipo_articulo import TipoArticulo
from models.genero import Genero
from models.cliente import Cliente
from models.empleado import Empleado
from models.idioma import Idioma
from models.elenco import Elenco
from models.descripcion_articulo import DescripcionArticulo
from models.solicitud_registro import SolicitudRegistro
from models.actividad import Actividad
from models.verificacion_correo import VerificacionCorreo
from models.usuario import Usuario
from models.rol import Rol

from routes.tipo_articulo_routes import tipo_articulo_bp
from routes.genero_routes import genero_bp
from routes.cliente_routes import cliente_bp
from routes.empleado_routes import empleado_bp
from routes.idioma_routes import idioma_bp
from routes.elenco_routes import elenco_bp
from routes.descripcion_articulo_routes import descripcion_articulo_bp
from routes.auth_routes import auth_bp
from routes.registro_routes import registro_bp
from routes.admin_routes import admin_bp
from routes.dashboard_routes import dashboard_bp
from routes.busqueda_routes import busqueda_bp
from routes.google_auth_routes import google_bp

from utilidades.seed_roles import crear_roles
from utilidades.seed_admin import crear_admin




app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)


app.register_blueprint(tipo_articulo_bp)
app.register_blueprint(genero_bp)
app.register_blueprint(cliente_bp)
app.register_blueprint(empleado_bp)
app.register_blueprint(idioma_bp)
app.register_blueprint(elenco_bp)
app.register_blueprint(descripcion_articulo_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(registro_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(busqueda_bp)
app.register_blueprint(google_bp)

bcrypt = Bcrypt(app)


app.config["JWT_SECRET_KEY"] = getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 900
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 604800


jwt = JWTManager(app)


with app.app_context():

    db.create_all()
    crear_roles()
    crear_admin()


@app.route("/")
def home():

    return {

        "message":
        "Sistema Video Club API funcionando"

    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
    