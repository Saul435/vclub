from flask import Blueprint
from flask import request
from flask import jsonify

from database import db

from models.descripcion_articulo import (
    DescripcionArticulo
)

descripcion_articulo_bp = Blueprint(
    "descripcion_articulo",
    __name__
)

@descripcion_articulo_bp.route(
    "/descripciones-articulo",
    methods=["GET"]
)
def get_descripciones():

    descripciones = (
        DescripcionArticulo.query.all()
    )

    return jsonify([
        d.to_dict()
        for d in descripciones
    ])

@descripcion_articulo_bp.route(
    "/descripciones-articulo",
    methods=["POST"]
)
def create_descripcion():

    data = request.json

    nuevo = DescripcionArticulo(
        titulo=data["titulo"],
        tipo_articulo_id=
            data["tipo_articulo_id"],
        idioma_id=
            data["idioma_id"],
        renta_dia=
            data["renta_dia"],
        dias_renta=
            data["dias_renta"],
        monto_entrega_tardia=
            data["monto_entrega_tardia"],
        estado=True
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(
        nuevo.to_dict()
    ), 201

@descripcion_articulo_bp.route(
    "/descripciones-articulo/<int:id>",
    methods=["PUT"]
)
def update_descripcion(id):

    descripcion = (
        DescripcionArticulo
        .query
        .get_or_404(id)
    )

    data = request.json

    descripcion.titulo = data["titulo"]

    descripcion.tipo_articulo_id = data["tipo_articulo_id"]

    descripcion.idioma_id = data["idioma_id"]

    descripcion.renta_dia = data["renta_dia"]

    descripcion.dias_renta = data["dias_renta"]

    descripcion.monto_entrega_tardia = data["monto_entrega_tardia"]

    db.session.commit()

    return jsonify(
        descripcion.to_dict()
    )

@descripcion_articulo_bp.route(
    "/descripciones-articulo/<int:id>/estado",
    methods=["PUT"]
)
def cambiar_estado(id):

    descripcion = (
        DescripcionArticulo
        .query
        .get_or_404(id)
    )

    descripcion.estado = not descripcion.estado

    db.session.commit()

    return jsonify(
        descripcion.to_dict()
    )


@descripcion_articulo_bp.route(
    "/descripciones-articulo/<int:id>",
    methods=["DELETE"]
)
def delete_descripcion(id):

    descripcion = (
        DescripcionArticulo
        .query
        .get_or_404(id)
    )

    db.session.delete(
        descripcion
    )

    db.session.commit()

    return jsonify({
        "message":
        "Artículo eliminado correctamente"
    })