from flask import Blueprint, request, jsonify

from database import db
from models.usuario import Usuario
from utilidades.correo import validar_correo

usuario_bp = Blueprint(
    "usuario",
    __name__
)

# ==========================
# OBTENER TODOS LOS USUARIOS
# ==========================

@usuario_bp.route("/usuarios", methods=["GET"])
def get_usuarios():

    usuarios = Usuario.query.all()

    return jsonify([
        u.to_dict()
        for u in usuarios
    ])


# ==========================
# CREAR USUARIO
# ==========================

@usuario_bp.route("/usuarios", methods=["POST"])
def create_usuario():

    data = request.json

    if not validar_correo(data["correo"]):

        return jsonify({

            "message":"El correo electrónico no es válido"

        }),400

    usuario_existente = Usuario.query.filter_by(

        correo=data["correo"]

    ).first()

    if usuario_existente:

        return jsonify({

            "message":"Ese correo ya existe"

        }),400

    nuevo = Usuario(

        correo=data["correo"],

        password=data["password"],

        rol=data["rol"],

        estado=True

    )

    db.session.add(nuevo)

    db.session.commit()

    return jsonify(

        nuevo.to_dict()

    ),201

# ==========================
# ACTUALIZAR USUARIO
# ==========================

@usuario_bp.route("/usuarios/<int:id>", methods=["PUT"])
def update_usuario(id):

    usuario = Usuario.query.get_or_404(id)

    data = request.json

    usuario.correo = data["correo"]

    usuario.password = data["password"]

    usuario.rol = data["rol"]

    db.session.commit()

    return jsonify(
        usuario.to_dict()
    )


# ==========================
# CAMBIAR ESTADO
# ==========================

@usuario_bp.route("/usuarios/<int:id>/estado", methods=["PUT"])
def cambiar_estado_usuario(id):

    usuario = Usuario.query.get_or_404(id)

    usuario.estado = not usuario.estado

    db.session.commit()

    return jsonify(
        usuario.to_dict()
    )


# ==========================
# ELIMINAR
# ==========================

@usuario_bp.route("/usuarios/<int:id>", methods=["DELETE"])
def delete_usuario(id):

    usuario = Usuario.query.get_or_404(id)

    db.session.delete(usuario)

    db.session.commit()

    return jsonify({
        "message":
        "Usuario eliminado correctamente"
    })


# ==========================
# LOGIN
# ==========================

@usuario_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    usuario = Usuario.query.filter_by(
        correo=data["correo"]
    ).first()

    if not usuario:

        return jsonify({
            "message":
            "Correo no encontrado"
        }), 404

    if usuario.password != data["password"]:

        return jsonify({
            "message":
            "Contraseña incorrecta"
        }), 401

    if not usuario.estado:

        return jsonify({
            "message":
            "Usuario inactivo"
        }), 403

    return jsonify({

        "id": usuario.id,

        "correo": usuario.correo,

        "rol": usuario.rol,

        "estado": usuario.estado

    })