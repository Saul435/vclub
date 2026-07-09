from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utilidades.decorators import admin_required

from database import db
from models.genero import Genero

from utilidades.validacion import (
    solo_letras,
    longitud
)


genero_bp = Blueprint(
    "genero",
    __name__
)



@genero_bp.route(
    "/generos",
    methods=["GET"]
)
@jwt_required()
def get_generos():

    generos = Genero.query.all()

    return jsonify([

        g.to_dict()

        for g in generos

    ])





@genero_bp.route(
    "/generos",
    methods=["POST"]
)
@jwt_required()
def create_genero():

    data = request.json or {}


    descripcion = data.get(
        "descripcion",
        ""
    ).strip()



    # =====================
    # VALIDACIONES
    # =====================


    if not descripcion:

        return jsonify({

            "error":
            "La descripción es obligatoria."

        }),400



    if not solo_letras(descripcion):

        return jsonify({

            "error":
            "El género solo puede contener letras."

        }),400



    if not longitud(
        descripcion,
        2,
        50
    ):

        return jsonify({

            "error":
            "El género debe tener entre 2 y 50 caracteres."

        }),400




    existe = Genero.query.filter_by(
        descripcion=descripcion
    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese género ya existe."

        }),400




    nuevo = Genero(

        descripcion=descripcion,

        estado=True

    )


    db.session.add(nuevo)

    db.session.commit()


    return jsonify(
        nuevo.to_dict()
    ),201





@genero_bp.route(
    "/generos/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_genero(id):

    genero = Genero.query.get_or_404(id)


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



    if not solo_letras(descripcion):

        return jsonify({

            "error":
            "El género solo puede contener letras."

        }),400



    if not longitud(
        descripcion,
        2,
        50
    ):

        return jsonify({

            "error":
            "El género debe tener entre 2 y 50 caracteres."

        }),400




    existe = Genero.query.filter(

        Genero.id != genero.id,

        Genero.descripcion == descripcion

    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese género ya existe."

        }),400




    genero.descripcion = descripcion


    db.session.commit()


    return jsonify(
        genero.to_dict()
    )






@genero_bp.route(
    "/generos/<int:id>/estado",
    methods=["PUT"]
)
@jwt_required()
@admin_required()
def cambiar_estado_genero(id):

    genero = Genero.query.get_or_404(id)


    genero.estado = not genero.estado


    db.session.commit()


    return jsonify(
        genero.to_dict()
    )





@genero_bp.route(
    "/generos/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
@admin_required()
def delete_genero(id):

    genero = Genero.query.get_or_404(id)


    db.session.delete(genero)

    db.session.commit()


    return jsonify({

        "message":
        "Genero eliminado correctamente"

    })