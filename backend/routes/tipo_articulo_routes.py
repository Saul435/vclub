from flask import Blueprint, request, jsonify

from database import db
from models.tipo_articulo import TipoArticulo

tipo_articulo_bp = Blueprint(
    "tipo_articulo",
    __name__
)


@tipo_articulo_bp.route("/tipos-articulo", methods=["GET"])
def get_tipos():

    tipos = TipoArticulo.query.all()

    return jsonify([
        t.to_dict()
        for t in tipos
    ])

@tipo_articulo_bp.route(
    "/tipos-articulo/buscar",
    methods=["GET"]
)
def buscar_tipo_articulos():

    descripcion = request.args.get("descripcion")

    estado = request.args.get("estado")

    consulta = TipoArticulo.query

    if descripcion:

        consulta = consulta.filter(

            TipoArticulo.descripcion.ilike(

                f"%{descripcion}%"

            )

        )

    if estado != "" and estado is not None:

        consulta = consulta.filter(

            TipoArticulo.estado ==

            (estado.lower() == "true")

        )

    return jsonify([

        t.to_dict()

        for t in consulta.all()

    ])

@tipo_articulo_bp.route("/tipos-articulo/<int:id>", methods=["GET"])
def get_tipo(id):

    tipo = TipoArticulo.query.get_or_404(id)

    return jsonify(tipo.to_dict())

@tipo_articulo_bp.route("/tipos-articulo", methods=["POST"])
def create_tipo():

    data = request.json

    nuevo = TipoArticulo(
        descripcion=data["descripcion"],
        estado=data["estado"]
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.to_dict()), 201

@tipo_articulo_bp.route("/tipos-articulo/<int:id>", methods=["PUT"])
def update_tipo(id):

    tipo = TipoArticulo.query.get_or_404(id)

    data = request.json

    tipo.descripcion = data["descripcion"]
    tipo.estado = data["estado"]

    db.session.commit()

    return jsonify(tipo.to_dict())


@tipo_articulo_bp.route("/tipos-articulo/<int:id>/estado", methods=["PUT"])
def cambiar_estado(id):

    tipo = TipoArticulo.query.get_or_404(id)

    tipo.estado = not tipo.estado

    db.session.commit()

    return jsonify(tipo.to_dict())

@tipo_articulo_bp.route(
    "/tipos-articulo/<int:id>",
    methods=["DELETE"]
)
def delete_tipo_articulo(id):

    tipo = TipoArticulo.query.get_or_404(id)

    db.session.delete(tipo)

    db.session.commit()

    return jsonify({
        "message":
        "Tipo de artículo eliminado correctamente"
    })

