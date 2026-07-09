import bcrypt
from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from database import db

from models.usuario import Usuario
from models.rol import Rol
from models.actividad import Actividad
from models.solicitud_registro import SolicitudRegistro



from datetime import datetime
from flask import request
from services.email_service import enviar_correo
from utilidades.registrar_actividad import registrar_actividad
from models.verificacion_correo import VerificacionCorreo
from utilidades.decorators import admin_required
from utilidades.cedula import validar_cedula
from utilidades.seed_admin import correo_admin
from flask import g

admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/admin"
)






@admin_bp.route(
    "/solicitudes",
    methods=["GET"]
)
@jwt_required()
@admin_required()
def solicitudes():


    solicitudes = SolicitudRegistro.query.filter_by(

        correo_verificado=True,

        estado="Pendiente"

    ).order_by(

        SolicitudRegistro.id.desc()

    ).all()


    return jsonify([

        s.to_dict()

        for s in solicitudes

    ])





@admin_bp.route(
    "/solicitudes/<int:id>/aprobar",
    methods=["POST"]
)
@jwt_required()
@admin_required()
def aprobar_solicitud(id):

    admin = g.usuario_actual

    
    solicitud = SolicitudRegistro.query.get_or_404(id)


    if solicitud.estado != "Pendiente":

        return jsonify({

            "error":"La solicitud ya fue procesada."

        }),400


    data = request.json or {}

    nombre_rol = "Empleado"


    rol = Rol.query.filter_by(
        nombre=nombre_rol
    ).first()


    if not rol:

        return jsonify({

            "error":"Rol inválido."

        }),400


    existe = Usuario.query.filter(

        (Usuario.correo == solicitud.correo)

    ).first()


    if existe:

        return jsonify({

            "error":"Ese usuario ya existe."

        }),400


    usuario = Usuario(

        nombre=solicitud.nombre,

        apellido=solicitud.apellido,

        cedula=solicitud.cedula,

        telefono=solicitud.telefono,

        correo=solicitud.correo,

        password_hash=solicitud.password_hash,

        activo=True,

        rol_id=rol.id,

        creado_por=admin.id

    )


    db.session.add(usuario)


    solicitud.estado = "Aprobado"

    solicitud.aprobado_por = admin.id

    solicitud.fecha_respuesta = datetime.utcnow()

    solicitud.observacion = "Solicitud aprobada."


    db.session.commit()


    try:

        enviar_correo(

            solicitud.correo,

            "Solicitud aprobada",

            f"""

            <h2>Video Club</h2>

            <p>Hola {solicitud.nombre}.</p>

            <p>Tu solicitud ha sido aprobada.</p>

            <p>Rol asignado:
            <b>{rol.nombre}</b></p>

            <p>Ya puedes iniciar sesión.</p>

            """

        )

    except:

        pass


    registrar_actividad(

        admin.id,

        "Aprobó solicitud",

        f"{admin.nombre} aprobó a {solicitud.nombre} ({rol.nombre})",

        request.remote_addr

    )


    return jsonify({

        "message":"Solicitud aprobada.",

        "usuario":usuario.to_dict()

    })


@admin_bp.route(
    "/solicitudes/<int:id>/rechazar",
    methods=["POST"]
)
@jwt_required()
@admin_required()
def rechazar_solicitud(id):

    admin = g.usuario_actual



    solicitud = SolicitudRegistro.query.get_or_404(id)


    if solicitud.estado != "Pendiente":

        return jsonify({

            "error":"La solicitud ya fue procesada."

        }),400


    data = request.json or {}

    motivo = data.get(
        "motivo",
        ""
    ).strip()


    solicitud.estado = "Rechazado"

    solicitud.observacion = motivo

    solicitud.aprobado_por = admin.id

    solicitud.fecha_respuesta = datetime.utcnow()


    db.session.commit()


    try:

        enviar_correo(

            solicitud.correo,

            "Solicitud rechazada",

            f"""

            <h2>Video Club</h2>

            <p>Hola {solicitud.nombre}.</p>

            <p>Tu solicitud fue rechazada.</p>

            <p><b>Motivo:</b></p>

            <p>{motivo}</p>

            """

        )

    except:

        pass


    registrar_actividad(

        admin.id,

        "Rechazó solicitud",

        f"{admin.nombre} rechazó a {solicitud.nombre}",

        request.remote_addr

    )


    return jsonify({

        "message":"Solicitud rechazada."

    })

@admin_bp.route(
    "/usuarios",
    methods=["GET"]
)
@jwt_required()
@admin_required()
def usuarios():

    usuarios = Usuario.query.filter(
        Usuario.rol.has(
            Rol.nombre!="Administrador"
        )
    ).order_by(
        Usuario.nombre
    ).all()


    return jsonify([
        u.to_dict()
        for u in usuarios
    ])




@admin_bp.route(
    "/usuarios",
    methods=["POST"]
)
@jwt_required()
@admin_required()
def crear_usuario():

    admin = g.usuario_actual

    data = request.json

    nombre = data.get("nombre","").strip()
    apellido = data.get("apellido","").strip()
    cedula = data.get("cedula","").strip()
    telefono = data.get("telefono","").strip()
    correo = data.get("correo","").strip()
    password = data.get("password","").strip()

    if not validar_cedula(cedula):

        return jsonify({

            "error": "La cédula ingresada no es válida."

        }),400


    if not all([
        nombre,
        apellido,
        cedula,
        correo,
        password
    ]):

        return jsonify({
            "error":"Complete todos los campos."
        }),400


    existe = Usuario.query.filter_by(
        correo=correo
    ).first()

    if existe:

        return jsonify({
            "error":"Ese correo ya existe."
        }),400


    rol = Rol.query.filter_by(
        nombre="Empleado"
    ).first()


    usuario = Usuario(

        nombre=nombre,

        apellido=apellido,

        cedula=cedula,

        telefono=telefono,

        correo=correo,

        password_hash=bcrypt.generate_password_hash(
            password
        ).decode("utf-8"),

        activo=True,

        rol_id=rol.id,

        creado_por=admin.id

    )


    db.session.add(usuario)

    db.session.commit()


    registrar_actividad(

        admin.id,

        "Creó usuario",

        f"{admin.nombre} creó a {usuario.nombre}",

        request.remote_addr

    )


    return jsonify(usuario.to_dict()),201



@admin_bp.route(
    "/usuarios/<int:id>",
    methods=["PUT"]
)
@jwt_required()
@admin_required()
def editar_usuario(id):

    admin = g.usuario_actual


    usuario = Usuario.query.get_or_404(id)

    data = request.json or {}


    correo = data.get(
        "correo",
        usuario.correo
    ).strip()

    cedula = data.get(
        "cedula",
        usuario.cedula
    ).strip()

    if not validar_cedula(cedula):

        return jsonify({

            "error": "La cédula ingresada no es válida."

        }),400


    existe = Usuario.query.filter(

        Usuario.id != usuario.id,

        Usuario.correo == correo

    ).first()

    if existe:

        return jsonify({

            "error": "Ese correo ya existe."

        }), 400


    existe = Usuario.query.filter(

        Usuario.id != usuario.id,

        Usuario.cedula == cedula

    ).first()

    if existe:

        return jsonify({

            "error": "Esa cédula ya existe."

        }), 400


    usuario.nombre = data.get(
        "nombre",
        usuario.nombre
    )

    usuario.apellido = data.get(
        "apellido",
        usuario.apellido
    )

    usuario.cedula = cedula

    usuario.telefono = data.get(
        "telefono",
        usuario.telefono
    )

    usuario.correo = correo


    db.session.commit()


    registrar_actividad(

        admin.id,

        "Editó usuario",

        f"{admin.nombre} editó a {usuario.nombre}",

        request.remote_addr

    )


    return jsonify({

        "message": "Usuario actualizado.",

        "usuario": usuario.to_dict()

    })


@admin_bp.route(
    "/usuarios/<int:id>/estado",
    methods=["PUT"]
)
@jwt_required()
@admin_required()
def cambiar_estado_usuario(id):

    admin = g.usuario_actual

    usuario = Usuario.query.get_or_404(id)


    if usuario.correo == correo_admin:

        return jsonify({

            "error": "No puedes desactivar el administrador principal."

        }), 400


    usuario.activo = not usuario.activo

    db.session.commit()


    registrar_actividad(

        admin.id,

        "Cambió estado usuario",

        f"{usuario.nombre} -> {'Activo' if usuario.activo else 'Inactivo'}",

        request.remote_addr

    )


    return jsonify({

        "message": "Estado actualizado.",

        "activo": usuario.activo

    })


@admin_bp.route(
    "/usuarios/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
@admin_required()
def eliminar_usuario(id):

    admin = g.usuario_actual

    usuario = Usuario.query.get_or_404(id)


    if usuario.correo == correo_admin:

        return jsonify({

            "error": "No puedes eliminar el administrador principal."

        }), 400


    db.session.delete(usuario)

    db.session.commit()


    registrar_actividad(

        admin.id,

        "Eliminó usuario",

        usuario.nombre,

        request.remote_addr

    )


    return jsonify({

        "message": "Usuario eliminado."

    })



@admin_bp.route(
    "/actividades",
    methods=["GET"]
)
@jwt_required()
@admin_required()

def actividades():

  


    actividades = Actividad.query.order_by(

        Actividad.fecha.desc()

    ).limit(100).all()


    return jsonify([

        a.to_dict()

        for a in actividades

    ])