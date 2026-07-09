from database import db


class Actividad(db.Model):

    __tablename__ = "actividades"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    usuario_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        nullable=True
    )

    accion = db.Column(
        db.String(100),
        nullable=False
    )

    descripcion = db.Column(
        db.Text,
        nullable=False
    )

    ip = db.Column(
        db.String(45),
        nullable=True
    )

    fecha = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    usuario = db.relationship(
        "Usuario"
    )

    def to_dict(self):

        return {

            "id": self.id,

            "usuario": self.usuario.nombre if self.usuario else None,

            "accion": self.accion,

            "descripcion": self.descripcion,

            "ip": self.ip,

            "fecha": self.fecha

        }