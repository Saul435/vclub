from database import db

class Usuario(db.Model):

    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)

    correo = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    rol = db.Column(
        db.String(30),
        nullable=False
    )

    estado = db.Column(
        db.Boolean,
        default=True
    )

    def to_dict(self):

        return {

            "id": self.id,
            "correo": self.correo,
            "rol": self.rol,
            "estado": self.estado

        }