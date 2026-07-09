from database import db


class Usuario(db.Model):

    __tablename__ = "usuarios"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    nombre = db.Column(
        db.String(80),
        nullable=False
    )

    apellido = db.Column(
        db.String(80),
        nullable=False
    )

    cedula = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    telefono = db.Column(
        db.String(20),
        nullable=True
    )

    correo = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=True
    )

    google_id = db.Column(
        db.String(255),
        unique=True,
        nullable=True
    )

    foto = db.Column(
        db.String(500),
        nullable=True
    )

    activo = db.Column(
        db.Boolean,
        default=False
    )

    ultimo_login = db.Column(
        db.DateTime,
        nullable=True
    )

    fecha_creacion = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    creado_por = db.Column(
        db.Integer,
        nullable=True
    )

    rol_id = db.Column(
        db.Integer,
        db.ForeignKey("roles.id"),
        nullable=False
    )

    rol = db.relationship(
        "Rol",
        back_populates="usuarios"
    )

    def to_dict(self):

        return {

            "id": self.id,

            "nombre": self.nombre,

            "apellido": self.apellido,

            "cedula": self.cedula,

            "telefono": self.telefono,

            "correo": self.correo,

            "foto": self.foto,

            "activo": self.activo,

            "rol": self.rol.nombre if self.rol else None

        }