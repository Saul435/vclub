from database import db
from models.rol import Rol



def crear_roles():


    roles = [

        "Administrador",

        "Empleado"

    ]


    for nombre in roles:


        existe = Rol.query.filter_by(
            nombre=nombre
        ).first()



        if not existe:

            nuevo = Rol(
                nombre=nombre
            )


            db.session.add(nuevo)



    db.session.commit()