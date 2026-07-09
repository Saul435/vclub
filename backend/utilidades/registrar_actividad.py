from database import db

from models.actividad import Actividad


def registrar_actividad(

    usuario_id,

    accion,

    descripcion,

    ip=None

):

    actividad = Actividad(

        usuario_id=usuario_id,

        accion=accion,

        descripcion=descripcion,

        ip=ip

    )

    db.session.add(
        actividad
    )

    db.session.commit()