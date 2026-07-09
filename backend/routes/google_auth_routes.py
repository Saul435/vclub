from flask import Blueprint, request, jsonify

from google.oauth2 import id_token
from google.auth.transport import requests

from models.usuario import Usuario
from models.solicitud_registro import SolicitudRegistro
from flask_jwt_extended import ( create_access_token, create_refresh_token )
from utilidades.cedula import validar_cedula
from database import db

from os import getenv

google_bp = Blueprint(
    "google",
    __name__,
    url_prefix="/google"
)

@google_bp.route(
    "/login",
    methods=["POST"]
)
def google_login():

    data = request.json

    credential = data.get("credential")

    if not credential:

        return jsonify({
            "error": "Token no recibido."
        }), 400

    try:

        info = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            getenv("GOOGLE_CLIENT_ID")
        )

        correo = info.get("email").lower()
        google_id = info.get("sub")
        nombre = info.get("given_name")
        apellido = info.get("family_name")
        correo_verificado = info.get("email_verified")

        if not correo_verificado:

            return jsonify({

                "error": "La cuenta de Google no está verificada."

            }), 400
        
        usuario = Usuario.query.filter_by(
            correo=correo
        ).first()


        solicitud = SolicitudRegistro.query.filter_by(
            correo=correo
        ).first()



        if usuario:


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



        if solicitud:


            return jsonify({

                "solicitud": True,

                "estado": solicitud.estado,

                "mensaje":
                "Existe una solicitud pendiente."

            })



        return jsonify({

            "usuario": False,

            "solicitud": False,

            "correo": correo,

            "google_id": google_id,

            "nombre": nombre,

            "apellido": apellido

        })
    
    except Exception:

        return jsonify({

            "error": "Token de Google inválido."

        }),401
    
@google_bp.route(
    "/register",
    methods=["POST"]
)
def google_register():

    data = request.json


    try:

        nombre = data.get("nombre")
        apellido = data.get("apellido")
        correo = data.get("correo")
        cedula = data.get("cedula")
        telefono = data.get("telefono")
        google_id = data.get("google_id")

        if not validar_cedula(cedula):

            return jsonify({

                "error":
                "La cédula ingresada no es válida."

            }),400


        if not all([
            nombre,
            apellido,
            correo,
            cedula,
            google_id
        ]):

            return jsonify({

                "error": "Datos incompletos."

            }),400



        existe_usuario = Usuario.query.filter_by(
            correo=correo
        ).first()


        if existe_usuario:

            return jsonify({

                "error": "Este correo ya está registrado."

            }),400



        existe_solicitud = SolicitudRegistro.query.filter_by(
            correo=correo
        ).first()


        if existe_solicitud:

            return jsonify({

                "error": "Ya existe una solicitud con este correo."

            }),400
        
        cedula_existente = SolicitudRegistro.query.filter_by(
            cedula=cedula
        ).first()


        if cedula_existente:

            return jsonify({

                "error":
                "Esta cédula ya tiene una solicitud registrada."

            }),400



        solicitud = SolicitudRegistro(

            nombre=nombre,

            apellido=apellido,

            correo=correo,

            cedula=cedula,

            telefono=telefono,

            google_id=google_id,

            password_hash=None,

            correo_verificado=True,

            estado="Pendiente"

        )


        db.session.add(solicitud)

        db.session.commit()



        return jsonify({

            "mensaje":
            "Solicitud creada correctamente."

        }),201



    except Exception as e:


        db.session.rollback()


        print(
            "ERROR GOOGLE REGISTER:",
            e
        )


        return jsonify({

            "error":
            "Error creando solicitud."

        }),500


    