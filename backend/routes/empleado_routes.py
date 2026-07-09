from flask import Blueprint, request, jsonify

from database import db
from models.empleado import Empleado
from models.usuario import Usuario
from utilidades.cedula import validar_cedula

empleado_bp = Blueprint(
    "empleado",
    __name__
)

@empleado_bp.route("/empleados", methods=["GET"])
def get_empleados():

    empleados = Empleado.query.all()

    return jsonify([
        e.to_dict()
        for e in empleados
    ])

@empleado_bp.route(
    "/empleados/buscar",
    methods=["GET"]
)
def buscar_empleados():

    nombre = request.args.get("nombre")

    cedula = request.args.get("cedula")

    tanda_labor = request.args.get("tanda_labor")

    estado = request.args.get("estado")

    consulta = Empleado.query

    if nombre:

        consulta = consulta.filter(

            Empleado.nombre.ilike(

                f"%{nombre}%"

            )

        )

    if cedula:

        consulta = consulta.filter(

            Empleado.cedula.ilike(

                f"%{cedula}%"

            )

        )

    if tanda_labor:

        consulta = consulta.filter(

            Empleado.tanda_labor ==

            tanda_labor

        )

    if estado != "" and estado is not None:

        consulta = consulta.filter(

            Empleado.estado ==

            (estado.lower() == "true")

        )

    return jsonify([

        e.to_dict()

        for e in consulta.all()

    ])

@empleado_bp.route("/empleados", methods=["POST"])
def create_empleado():

    data = request.json

    if not validar_cedula(
    data["cedula"]
):

        return jsonify({
            "message":
            "La cédula es inválida"
        }), 400
    
    empleado_existente = (
    Empleado.query.filter_by(
        cedula=data["cedula"]
    ).first()
)

    if empleado_existente:

        return jsonify({
            "message":
            "Esta cédula ya existe"
        }), 400

    nuevo = Empleado(
        nombre=data["nombre"],
        cedula=data["cedula"],
        tanda_labor=data["tanda_labor"],
        porciento_comision=data["porciento_comision"],
        fecha_ingreso=data["fecha_ingreso"],
        estado=True
    )

    db.session.add(nuevo)
    db.session.flush()

# CREAR USUARIO AUTOMÁTICAMENTE
   

    correo = (
    nuevo.nombre
    .lower()
    .replace(" ", ".")
    + str(nuevo.id)
    + "@videoclub.com"
    )

    password = (
        nuevo.nombre.split()[0].capitalize()
        + str(nuevo.id)
        + "*"
    )

    nuevo_usuario = Usuario(
    correo=correo,
    password=password,
    rol="Empleado",
    estado=True,
    empleado_id=nuevo.id
    )

    db.session.add(nuevo_usuario)
    db.session.commit()

    

    return jsonify({
        "empleado": nuevo.to_dict(),
        "usuario":{
            "correo":correo,
            "password":password
        },

        "message":"Empleado y usuario creados correctamente"

    }),201

@empleado_bp.route("/empleados/<int:id>", methods=["PUT"])
def update_empleado(id):

    empleado = Empleado.query.get_or_404(id)

    data = request.json

    empleado.nombre = data["nombre"]
    empleado.cedula = data["cedula"]
    empleado.tanda_labor = data["tanda_labor"]
    empleado.porciento_comision = data["porciento_comision"]
    empleado.fecha_ingreso = data["fecha_ingreso"]

    db.session.commit()

    return jsonify(
        empleado.to_dict()
    )

@empleado_bp.route("/empleados/<int:id>/estado", methods=["PUT"])
def cambiar_estado_empleado(id):

    empleado = Empleado.query.get_or_404(id)

    empleado.estado = not empleado.estado

    db.session.commit()

    return jsonify(
        empleado.to_dict()
    )

@empleado_bp.route(
    "/empleados/<int:id>",
    methods=["DELETE"]
)
def delete_empleado(id):

    empleado = Empleado.query.get_or_404(id)

    usuario = Usuario.query.filter_by(
        empleado_id=id
    ).first()

    if usuario:
        db.session.delete(usuario)

    db.session.delete(empleado)

    db.session.commit()

    return jsonify({
        "message":
        "Empleado y usuario eliminados correctamente"
    })
