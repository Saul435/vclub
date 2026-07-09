from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utilidades.decorators import admin_required


from database import db
from models.elenco import Elenco

from utilidades.validacion import (
    solo_letras,
    longitud
)


elenco_bp = Blueprint(
    "elenco",
    __name__
)



@elenco_bp.route(
    "/elencos",
    methods=["GET"]
)
@jwt_required()
def get_elencos():

    elencos = Elenco.query.all()

    return jsonify([

        e.to_dict()

        for e in elencos

    ])





@elenco_bp.route(
    "/elencos",
    methods=["POST"]
)
@jwt_required()
def create_elenco():

    data = request.json or {}


    nombre = data.get(
        "nombre",
        ""
    ).strip()



    # =====================
    # VALIDACIONES
    # =====================


    if not nombre:

        return jsonify({

            "error":
            "El nombre es obligatorio."

        }),400



    if not solo_letras(nombre):

        return jsonify({

            "error":
            "El nombre solo puede contener letras."

        }),400



    if not longitud(
        nombre,
        2,
        80
    ):

        return jsonify({

            "error":
            "El nombre debe tener entre 2 y 80 caracteres."

        }),400




    existe = Elenco.query.filter_by(
        nombre=nombre
    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese actor ya existe."

        }),400





    nuevo = Elenco(

        nombre=nombre,

        estado=True

    )


    db.session.add(nuevo)

    db.session.commit()


    return jsonify(
        nuevo.to_dict()
    ),201







@elenco_bp.route(
    "/elencos/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_elenco(id):

    elenco = Elenco.query.get_or_404(id)


    data = request.json or {}



    nombre = data.get(
        "nombre",
        ""
    ).strip()



    if not nombre:

        return jsonify({

            "error":
            "El nombre es obligatorio."

        }),400



    if not solo_letras(nombre):

        return jsonify({

            "error":
            "El nombre solo puede contener letras."

        }),400



    if not longitud(
        nombre,
        2,
        80
    ):

        return jsonify({

            "error":
            "El nombre debe tener entre 2 y 80 caracteres."

        }),400





    existe = Elenco.query.filter(

        Elenco.id != elenco.id,

        Elenco.nombre == nombre

    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese actor ya existe."

        }),400




    elenco.nombre = nombre


    db.session.commit()


    return jsonify(
        elenco.to_dict()
    )







@elenco_bp.route(
    "/elencos/<int:id>/estado",
    methods=["PUT"]
)
@jwt_required()
@admin_required()
def cambiar_estado_elenco(id):

    elenco = Elenco.query.get_or_404(id)


    elenco.estado = not elenco.estado


    db.session.commit()


    return jsonify(
        elenco.to_dict()
    )






@elenco_bp.route(
    "/elencos/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
@admin_required()
def delete_elenco(id):

    elenco = Elenco.query.get_or_404(id)


    db.session.delete(elenco)

    db.session.commit()


    return jsonify({

        "message":
        "Elenco eliminado correctamente"

    })