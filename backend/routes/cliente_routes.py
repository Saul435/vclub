from flask import Blueprint, request, jsonify

from database import db
from models.cliente import Cliente
from utilidades.cedula import validar_cedula

cliente_bp = Blueprint(
    "cliente",
    __name__
)

@cliente_bp.route("/clientes", methods=["GET"])
def get_clientes():

    clientes = Cliente.query.all()

    return jsonify([
        c.to_dict()
        for c in clientes
    ])

@cliente_bp.route("/clientes", methods=["POST"])
def create_cliente():

    data = request.json

    if not validar_cedula(
        data["cedula"]
    ):

        return jsonify({
            "message":
            "La cédula es inválida"
        }), 400
    
    cliente_existente = (
    Cliente.query.filter_by(
        cedula=data["cedula"]
    ).first()
)

    if cliente_existente:

        return jsonify({
            "message":
            "Esta cédula ya existe"
        }), 400

    nuevo = Cliente(
        nombre=data["nombre"],
        cedula=data["cedula"],
        tarjeta_credito=data["tarjeta_credito"],
        limite_credito=data["limite_credito"],
        tipo_persona=data["tipo_persona"],
        estado=True
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(
        nuevo.to_dict()
    ), 201



@cliente_bp.route("/clientes/<int:id>", methods=["PUT"])
def update_cliente(id):

    cliente = Cliente.query.get_or_404(id)

    data = request.json

    cliente.nombre = data["nombre"]
    cliente.cedula = data["cedula"]
    cliente.tarjeta_credito = data["tarjeta_credito"]
    cliente.limite_credito = data["limite_credito"]
    cliente.tipo_persona = data["tipo_persona"]

    db.session.commit()

    return jsonify(
        cliente.to_dict()
    )

@cliente_bp.route("/clientes/<int:id>/estado", methods=["PUT"])
def cambiar_estado_cliente(id):

    cliente = Cliente.query.get_or_404(id)

    cliente.estado = not cliente.estado

    db.session.commit()

    return jsonify(
        cliente.to_dict()
    )

@cliente_bp.route( "/clientes/<int:id>", methods=["DELETE"])
def delete_cliente(id):

    cliente = Cliente.query.get_or_404(id)

    db.session.delete(cliente)

    db.session.commit()

    return jsonify({
        "message":
        "Cliente eliminado correctamente"
    })