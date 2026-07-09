from flask import Blueprint, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from models.usuario import Usuario
from models.cliente import Cliente
from models.descripcion_articulo import DescripcionArticulo
from models.idioma import Idioma
from models.actividad import Actividad


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/dashboard"
)


@dashboard_bp.route(
    "/resumen",
    methods=["GET"]
)
@jwt_required()
def resumen():

    usuario = Usuario.query.get(
        int(get_jwt_identity())
    )

    if not usuario:
        return jsonify({
            "error": "No autorizado"
        }), 401


    peliculas = DescripcionArticulo.query.count()

    clientes = Cliente.query.count()

    empleados = Usuario.query.count()

    idiomas = Idioma.query.count()


    actividades = Actividad.query.order_by(
        Actividad.fecha.desc()
    ).limit(8).all()


    return jsonify({

        "estadisticas": {

            "peliculas": peliculas,

            "clientes": clientes,

            "empleados": empleados,

            "idiomas": idiomas

        },

        "actividades": [

            a.to_dict()

            for a in actividades

        ]

    })