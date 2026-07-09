from database import db

from models.usuario import Usuario
from models.rol import Rol

from flask_bcrypt import Bcrypt

from utilidades.cedula import validar_cedula

from os import getenv

bcrypt = Bcrypt()



correo_admin = getenv("ADMIN_EMAIL")
password_admin = getenv ("ADMIN_PASSWORD")
cedula_admin = "SYSTEM"

def crear_admin():

    admin_existente = Usuario.query.filter_by(
        correo=correo_admin
    ).first()

    if admin_existente:

        return

    rol_admin = Rol.query.filter_by(
        nombre="Administrador"
    ).first()



    admin = Usuario(
        nombre="Administrador",
        apellido="Sistema",
        cedula=cedula_admin,
        telefono=None,
        correo=correo_admin,
        password_hash=bcrypt.generate_password_hash(
            password_admin
        ).decode("utf-8"),
        rol_id=rol_admin.id,
        activo=True
    )

    db.session.add(admin)
    db.session.commit()

    print(
        "Administrador inicial creado correctamente.  ;)"
    )