from database import db


class Rol(db.Model):

    __tablename__ = "roles"


    id = db.Column(
        db.Integer,
        primary_key=True
    )


    nombre = db.Column(
        db.String(50),
        unique=True,
        nullable=False
    )


    usuarios = db.relationship(
        "Usuario",
        back_populates="rol",
        lazy=True
    )


    def to_dict(self):

        return {
            "id": self.id,
            "nombre": self.nombre
        }