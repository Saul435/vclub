from functools import wraps

from flask import jsonify, g

from flask_jwt_extended import (
    get_jwt_identity
)

from models.usuario import Usuario



def admin_required():

    def decorator(func):

        @wraps(func)

        def wrapper(*args, **kwargs):

            usuario = Usuario.query.get(
                int(get_jwt_identity())
            )


            if not usuario:

                return jsonify({

                    "error":
                    "Usuario no encontrado."

                }),404



            if not usuario.rol or usuario.rol.nombre != "Administrador":

                return jsonify({

                    "error":
                    "No tiene permisos."

                }),403



            g.usuario_actual = usuario


            return func(
                *args,
                **kwargs
            )


        return wrapper

    return decorator