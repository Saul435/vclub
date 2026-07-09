from flask import Blueprint, request, jsonify

from flask_bcrypt import Bcrypt

from datetime import datetime, timedelta

from database import db

from models.usuario import Usuario
from models.solicitud_registro import SolicitudRegistro
from models.verificacion_correo import VerificacionCorreo

from utilidades.cedula import validar_cedula
from utilidades.generar_codigo import generar_codigo
from utilidades.registrar_actividad import registrar_actividad

from services.email_service import enviar_correo

from email_validator import validate_email, EmailNotValidError


registro_bp = Blueprint(
    "registro",
    __name__,
    url_prefix="/registro"
)

bcrypt = Bcrypt()


@registro_bp.route(
    "/solicitar",
    methods=["POST"]
)

def solicitar_registro():

    data = request.json

    nombre = data.get("nombre", "").strip()

    apellido = data.get("apellido", "").strip()

    cedula = data.get("cedula", "").strip()

    telefono = data.get("telefono", "").strip()

    correo = data.get("correo", "").strip().lower()

    password = data.get("password")

    confirmar = data.get("confirmar_password")


    if not all([
        nombre,
        apellido,
        cedula,
        correo,
        password,
        confirmar
    ]):

        return jsonify({
            "error":"Todos los campos son obligatorios."
        }),400


    if password != confirmar:

        return jsonify({
            "error":"Las contraseñas no coinciden."
        }),400


    if len(password) < 8:

        return jsonify({
            "error":"La contraseña debe tener mínimo 8 caracteres."
        }),400


    if not validar_cedula(cedula):

        return jsonify({
            "error":"La cédula no es válida."
        }),400


    try:

        validate_email(correo)

    except EmailNotValidError:

        return jsonify({
            "error":"Correo inválido."
        }),400


    usuario = Usuario.query.filter_by(
        correo=correo
    ).first()

    if usuario:

        return jsonify({
            "error":"Ese correo ya pertenece a un usuario."
        }),400


    solicitud = SolicitudRegistro.query.filter_by(
        correo=correo
    ).first()

    if solicitud:

        return jsonify({
            "error":"Ya existe una solicitud para ese correo."
        }),400


    codigo = generar_codigo()

    password_hash = bcrypt.generate_password_hash(
        password
    ).decode("utf-8")


    solicitud = SolicitudRegistro(

        nombre=nombre,

        apellido=apellido,

        cedula=cedula,

        telefono=telefono,

        correo=correo,

        password_hash=password_hash

    )

    db.session.add(solicitud)

    db.session.flush()

    verificacion = VerificacionCorreo(

        solicitud_id=solicitud.id,

        codigo=codigo,

        fecha_expiracion=datetime.utcnow() + timedelta(minutes=10)

    )

    db.session.add(verificacion)

    db.session.commit()


    mensaje = f"""
    <h2>Video Club</h2>

    <p>Tu código de verificación es:</p>

    <h1>{codigo}</h1>

    <p>Expira en 10 minutos.</p>
    """

    enviar_correo(
        correo,
        "Verificación de correo",
        mensaje
    )


    registrar_actividad(

        None,

        "Solicitud de registro",

        f"Solicitud enviada por {correo}",

        request.remote_addr

    )


    return jsonify({

        "message":"Solicitud enviada correctamente."

    }),201


@registro_bp.route(
    "/verificar",
    methods=["POST"]
)
def verificar_codigo():

    data = request.json

    correo = data.get("correo", "").strip().lower()

    codigo = data.get("codigo", "").strip()

    solicitud = SolicitudRegistro.query.filter_by(
        correo=correo
    ).first()

    if not solicitud:

        return jsonify({
            "error": "Solicitud no encontrada."
        }),404


    verificacion = VerificacionCorreo.query.filter_by(

        solicitud_id=solicitud.id,

        codigo=codigo,

        usado=False

    ).first()


    if not verificacion:

        return jsonify({

            "error":"Código incorrecto."

        }),400


    if datetime.utcnow() > verificacion.fecha_expiracion:

        return jsonify({

            "error":"El código expiró."

        }),400


    verificacion.usado = True

    solicitud.correo_verificado = True

    db.session.commit()


    registrar_actividad(

        None,

        "Correo verificado",

        f"{correo} verificó su correo.",

        request.remote_addr

    )


    return jsonify({

        "message":"Correo verificado correctamente."

    })

@registro_bp.route(
    "/reenviar",
    methods=["POST"]
)
def reenviar_codigo():

    data = request.json

    correo = data.get("correo", "").strip().lower()

    solicitud = SolicitudRegistro.query.filter_by(
        correo=correo
    ).first()

    if not solicitud:

        return jsonify({

            "error":"Solicitud no encontrada."

        }),404


    if solicitud.correo_verificado:

        return jsonify({

            "error":"El correo ya fue verificado."

        }),400


    codigo = generar_codigo()


    VerificacionCorreo.query.filter_by(

        solicitud_id=solicitud.id,

        usado=False

    ).delete()


    nueva = VerificacionCorreo(

        solicitud_id=solicitud.id,

        codigo=codigo,

        fecha_expiracion=datetime.utcnow()+timedelta(minutes=10)

    )

    db.session.add(nueva)

    db.session.commit()


    mensaje=f"""

    <h2>Video Club</h2>

    <p>Tu nuevo código es:</p>

    <h1>{codigo}</h1>

    """

    enviar_correo(

        correo,

        "Nuevo código",

        mensaje

    )


    registrar_actividad(

        None,

        "Reenvío código",

        f"{correo} solicitó un nuevo código.",

        request.remote_addr

    )


    return jsonify({

        "message":"Código reenviado."

    })