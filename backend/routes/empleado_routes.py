from flask import Blueprint, request, jsonify

from database import db
from models.empleado import Empleado

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
    db.session.commit()

    return jsonify(
        nuevo.to_dict()
    ), 201

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

    db.session.delete(empleado)

    db.session.commit()

    return jsonify({
        "message":
        "Empleado eliminado correctamente"
    })