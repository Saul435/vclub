from flask import Blueprint, request, jsonify

from database import db
from models.genero import Genero

genero_bp = Blueprint(
    "genero",
    __name__
)

@genero_bp.route("/generos", methods=["GET"])
def get_generos():

    generos = Genero.query.all()

    return jsonify([
        g.to_dict()
        for g in generos
    ])

@genero_bp.route(
    "/generos/buscar",
    methods=["GET"]
)
def buscar_generos():

    descripcion = request.args.get("descripcion")

    estado = request.args.get("estado")

    consulta = Genero.query

    if descripcion:

        consulta = consulta.filter(

            Genero.descripcion.ilike(

                f"%{descripcion}%"

            )

        )

    if estado != "" and estado is not None:

        consulta = consulta.filter(

            Genero.estado ==

            (estado.lower() == "true")

        )

    return jsonify([

        g.to_dict()

        for g in consulta.all()

    ])

@genero_bp.route("/generos", methods=["POST"])
def create_genero():

    data = request.json

    nuevo = Genero(
        descripcion=data["descripcion"],
        estado=True
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.to_dict()), 201

@genero_bp.route("/generos/<int:id>", methods=["PUT"])
def update_genero(id):

    genero = Genero.query.get_or_404(id)

    data = request.json

    genero.descripcion = data["descripcion"]

    db.session.commit()

    return jsonify(genero.to_dict())

@genero_bp.route("/generos/<int:id>/estado", methods=["PUT"])
def cambiar_estado_genero(id):

    genero = Genero.query.get_or_404(id)

    genero.estado = not genero.estado

    db.session.commit()

    return jsonify(genero.to_dict())

@genero_bp.route(
    "/generos/<int:id>",
    methods=["DELETE"]
)
def delete_genero(id):

    genero = Genero.query.get_or_404(id)

    db.session.delete(genero)

    db.session.commit()

    return jsonify({
        "message":
        "Genero eliminado correctamente"
    })