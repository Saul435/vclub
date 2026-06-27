from flask import Blueprint, request, jsonify

from database import db
from models.elenco import Elenco

elenco_bp = Blueprint(
    "elenco",
    __name__
)

@elenco_bp.route("/elencos", methods=["GET"])
def get_elencos():

    elencos = Elenco.query.all()

    return jsonify([
        e.to_dict()
        for e in elencos
    ])

@elenco_bp.route("/elencos", methods=["POST"])
def create_elenco():

    data = request.json

    nuevo = Elenco(
        nombre=data["nombre"],
        estado=True
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.to_dict()), 201

@elenco_bp.route("/elencos/<int:id>", methods=["PUT"])
def update_elenco(id):

    elenco = Elenco.query.get_or_404(id)

    data = request.json

    elenco.nombre = data["nombre"]

    db.session.commit()

    return jsonify(elenco.to_dict())

@elenco_bp.route("/elencos/<int:id>/estado", methods=["PUT"])
def cambiar_estado_elenco(id):

    elenco = Elenco.query.get_or_404(id)

    elenco.estado = not elenco.estado

    db.session.commit()

    return jsonify(elenco.to_dict())

@elenco_bp.route(
    "/elencos/<int:id>",
    methods=["DELETE"]
)
def delete_elenco(id):

    elenco = Elenco.query.get_or_404(id)

    db.session.delete(elenco)

    db.session.commit()

    return jsonify({
        "message":
        "Elenco eliminado correctamente"
    })