from flask import Blueprint, request, jsonify

from database import db
from models.idioma import Idioma

idioma_bp = Blueprint(
    "idioma",
    __name__
)

@idioma_bp.route("/idiomas", methods=["GET"])
def get_idiomas():

    idiomas = Idioma.query.all()

    return jsonify([
        i.to_dict()
        for i in idiomas
    ])

@idioma_bp.route("/idiomas", methods=["POST"])
def create_idioma():

    data = request.json

    nuevo = Idioma(
        descripcion=data["descripcion"],
        estado=True
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.to_dict()), 201

@idioma_bp.route("/idiomas/<int:id>", methods=["PUT"])
def update_idioma(id):

    idioma = idioma.query.get_or_404(id)

    data = request.json

    idioma.descripcion = data["descripcion"]

    db.session.commit()

    return jsonify(idioma.to_dict())

@idioma_bp.route("/idiomas/<int:id>/estado", methods=["PUT"])
def cambiar_estado_idioma(id):

    idioma = Idioma.query.get_or_404(id)

    idioma.estado = not idioma.estado

    db.session.commit()

    return jsonify(idioma.to_dict())

@idioma_bp.route(
    "/idiomas/<int:id>",
    methods=["DELETE"]
)
def delete_idioma(id):

    idioma = Idioma.query.get_or_404(id)

    db.session.delete(idioma)

    db.session.commit()

    return jsonify({
        "message":
        "Idioma eliminado correctamente"
    })