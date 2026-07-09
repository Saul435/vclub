from database import db


class SolicitudRegistro(db.Model):

    __tablename__ = "solicitudes_registro"

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

    estado = db.Column(
        db.String(20),
        default="Pendiente"
    )

    correo_verificado = db.Column(
        db.Boolean,
        default=False
    )

    observacion = db.Column(
        db.Text,
        nullable=True
    )

    aprobado_por = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id"),
        nullable=True
    )

    aprobador = db.relationship(
        "Usuario",
        foreign_keys=[aprobado_por]
    )

    fecha_solicitud = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    fecha_respuesta = db.Column(
        db.DateTime,
        nullable=True
    )

    def to_dict(self):

        return {

            "id": self.id,

            "nombre": self.nombre,

            "apellido": self.apellido,

            "cedula": self.cedula,

            "telefono": self.telefono,

            "correo": self.correo,

            "estado": self.estado,

            "correo_verificado": self.correo_verificado,

            "observacion": self.observacion,

            "aprobado_por": self.aprobado_por,

            "aprobado_por": (
                self.aprobador.nombre
                if self.aprobador
                else None
            ),

            "fecha_solicitud": self.fecha_solicitud,

            "fecha_respuesta": self.fecha_respuesta

        }