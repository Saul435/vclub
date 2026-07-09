from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utilidades.decorators import admin_required

from database import db
from models.idioma import Idioma

from utilidades.validacion import (
    texto_seguro,
    longitud
)


idioma_bp = Blueprint(
    "idioma",
    __name__
)


@idioma_bp.route(
    "/idiomas",
    methods=["GET"]
)
@jwt_required()
def get_idiomas():

    idiomas = Idioma.query.all()

    return jsonify([

        i.to_dict()

        for i in idiomas

    ])



@idioma_bp.route(
    "/idiomas",
    methods=["POST"]
)
@jwt_required()
def create_idioma():

    data = request.json or {}


    descripcion = data.get(
        "descripcion",
        ""
    ).strip()



    # ======================
    # VALIDACIONES
    # ======================

    if not descripcion:

        return jsonify({

            "error":
            "La descripción es obligatoria."

        }),400



    if not texto_seguro(descripcion):

        return jsonify({

            "error":
            "El idioma contiene caracteres inválidos."

        }),400



    if not longitud(
        descripcion,
        2,
        50
    ):

        return jsonify({

            "error":
            "El idioma debe tener entre 2 y 50 caracteres."

        }),400



    existe = Idioma.query.filter_by(
        descripcion=descripcion
    ).first()


    if existe:

        return jsonify({

            "error":
            "Ese idioma ya existe."

        }),400



    nuevo = Idioma(

        descripcion=descripcion,

        estado=True

    )


    db.session.add(nuevo)

    db.session.commit()


    return jsonify(
        nuevo.to_dict()
    ),201





@idioma_bp.route(
    "/idiomas/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_idioma(id):

    idioma = Idioma.query.get_or_404(id)


    data = request.json or {}


    descripcion = data.get(
        "descripcion",
        ""
    ).strip()



    if not descripcion:

        return jsonify({

            "error":
            "La descripción es obligatoria."

        }),400



    if not texto_seguro(descripcion):

        return jsonify({

            "error":
            "El idioma contiene caracteres inválidos."

        }),400



    if not longitud(
        descripcion,
        2,
        50
    ):

        return jsonify({

            "error":
            "El idioma debe tener entre 2 y 50 caracteres."

        }),400



    existe = Idioma.query.filter(

        Idioma.id != idioma.id,

        Idioma.descripcion == descripcion

    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese idioma ya existe."

        }),400



    idioma.descripcion = descripcion


    db.session.commit()


    return jsonify(
        idioma.to_dict()
    )






@idioma_bp.route(
    "/idiomas/<int:id>/estado",
    methods=["PUT"]
)
@jwt_required()
@admin_required()
def cambiar_estado_idioma(id):

    idioma = Idioma.query.get_or_404(id)


    idioma.estado = not idioma.estado


    db.session.commit()


    return jsonify(
        idioma.to_dict()
    )





@idioma_bp.route(
    "/idiomas/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
@admin_required()
def delete_idioma(id):

    idioma = Idioma.query.get_or_404(id)


    db.session.delete(idioma)

    db.session.commit()


    return jsonify({

        "message":
        "Idioma eliminado correctamente"

    })