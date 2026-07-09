from flask import Blueprint, request, jsonify

from database import db

from models.usuario import Usuario
from models.rol import Rol
from models.solicitud_registro import SolicitudRegistro

from flask_bcrypt import Bcrypt

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)

from email_validator import validate_email, EmailNotValidError



auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)



bcrypt = Bcrypt()



# ==========================
# REGISTRO
# ==========================


@auth_bp.route(
    "/register",
    methods=["POST"]
)
def register():


    data = request.json


    nombre = data.get("nombre")

    correo = data.get("correo")

    password = data.get("password")



    if not nombre or not correo or not password:

        return jsonify({

            "error":
            "Todos los campos son obligatorios"

        }),400



    try:

        validate_email(correo)


    except EmailNotValidError:


        return jsonify({

            "error":
            "Correo inválido"

        }),400




    existe = Usuario.query.filter_by(
        correo=correo
    ).first()



    if existe:


        return jsonify({

            "error":
            "El correo ya existe"

        }),400




    rol_cliente = Rol.query.filter_by(
        nombre="Cliente"
    ).first()



    password_hash = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")




    usuario = Usuario(

        nombre=nombre,

        correo=correo,

        password_hash=password_hash,

        rol_id=rol_cliente.id

    )



    db.session.add(usuario)

    db.session.commit()



    return jsonify({

        "message":
        "Usuario creado correctamente"

    }),201





# ==========================
# LOGIN
# ==========================



@auth_bp.route(
    "/login",
    methods=["POST"]
)

def login():


    data=request.json


    correo=data.get("correo")

    password=data.get("password")



    usuario = Usuario.query.filter_by(
        correo=correo
    ).first()



    if not usuario:

        solicitud = SolicitudRegistro.query.filter_by(
            correo=correo
        ).first()


        if solicitud:

            if solicitud.estado == "Pendiente":

                return jsonify({

                    "error":
                    "Tu solicitud todavía está pendiente de aprobación."

                }),403


            if solicitud.estado == "Rechazado":

                return jsonify({

                    "error":
                    "Tu solicitud de registro fue rechazada."

                }),403


        return jsonify({

            "error":
            "Credenciales incorrectas"

        }),401




    if not bcrypt.check_password_hash(
        usuario.password_hash,
        password
    ):


        return jsonify({

            "error":
            "Credenciales incorrectas"

        }),401





    if not usuario.activo:


        return jsonify({

            "error":
            "Usuario desactivado"

        }),403




    access_token = create_access_token(

        identity=str(usuario.id)

    )


    refresh_token = create_refresh_token(

        identity=str(usuario.id)

    )




    return jsonify({


        "access_token":
        access_token,


        "refresh_token":
        refresh_token,


        "usuario":
        usuario.to_dict()


    })





# ==========================
# REFRESH TOKEN
# ==========================



from flask_jwt_extended import jwt_required, get_jwt_identity



@auth_bp.route(
    "/refresh",
    methods=["POST"]
)

@jwt_required(refresh=True)

def refresh():


    usuario_id = get_jwt_identity()



    token = create_access_token(

        identity=usuario_id

    )


    return jsonify({

        "access_token":
        token

    })