from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utilidades.decorators import admin_required


from database import db
from models.tipo_articulo import TipoArticulo

from utilidades.validacion import (
    solo_letras,
    longitud
)


tipo_articulo_bp = Blueprint(
    "tipo_articulo",
    __name__
)



@tipo_articulo_bp.route(
    "/tipos-articulo",
    methods=["GET"]
)
@jwt_required()
def get_tipos():

    tipos = TipoArticulo.query.all()

    return jsonify([

        t.to_dict()

        for t in tipos

    ])





@tipo_articulo_bp.route(
    "/tipos-articulo/<int:id>",
    methods=["GET"]
)
@jwt_required()
def get_tipo(id):

    tipo = TipoArticulo.query.get_or_404(id)

    return jsonify(
        tipo.to_dict()
    )






@tipo_articulo_bp.route(
    "/tipos-articulo",
    methods=["POST"]
)
@jwt_required()
def create_tipo():

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
            "El tipo de artículo solo puede contener letras."

        }),400



    if not longitud(
        descripcion,
        2,
        50
    ):

        return jsonify({

            "error":
            "El tipo debe tener entre 2 y 50 caracteres."

        }),400




    existe = TipoArticulo.query.filter_by(
        descripcion=descripcion
    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese tipo de artículo ya existe."

        }),400





    nuevo = TipoArticulo(

        descripcion=descripcion,

        estado=True

    )


    db.session.add(nuevo)

    db.session.commit()


    return jsonify(
        nuevo.to_dict()
    ),201








@tipo_articulo_bp.route(
    "/tipos-articulo/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_tipo(id):

    tipo = TipoArticulo.query.get_or_404(id)


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
            "El tipo de artículo solo puede contener letras."

        }),400



    if not longitud(
        descripcion,
        2,
        50
    ):

        return jsonify({

            "error":
            "El tipo debe tener entre 2 y 50 caracteres."

        }),400




    existe = TipoArticulo.query.filter(

        TipoArticulo.id != tipo.id,

        TipoArticulo.descripcion == descripcion

    ).first()



    if existe:

        return jsonify({

            "error":
            "Ese tipo de artículo ya existe."

        }),400





    tipo.descripcion = descripcion


    db.session.commit()


    return jsonify(
        tipo.to_dict()
    )








@tipo_articulo_bp.route(
    "/tipos-articulo/<int:id>/estado",
    methods=["PUT"]
)
@jwt_required()
@admin_required()
def cambiar_estado(id):

    tipo = TipoArticulo.query.get_or_404(id)


    tipo.estado = not tipo.estado


    db.session.commit()


    return jsonify(
        tipo.to_dict()
    )

@tipo_articulo_bp.route(
    "/tipos-articulo/activos",
    methods=["GET"]
)
@jwt_required()
def get_tipos_activos():

    tipos = TipoArticulo.query.filter_by(
        estado=True
    ).all()

    return jsonify([

        t.to_dict()

        for t in tipos

    ])







@tipo_articulo_bp.route(
    "/tipos-articulo/<int:id>",
    methods=["DELETE"]
)
@jwt_required()
@admin_required()
def delete_tipo_articulo(id):

    tipo = TipoArticulo.query.get_or_404(id)


    db.session.delete(tipo)

    db.session.commit()


    return jsonify({

        "message":
        "Tipo de artículo eliminado correctamente"

    })