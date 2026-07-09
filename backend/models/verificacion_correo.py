from database import db


class VerificacionCorreo(db.Model):

    __tablename__ = "verificaciones_correo"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    solicitud_id = db.Column(
        db.Integer,
        db.ForeignKey("solicitudes_registro.id"),
        nullable=False
    )

    codigo = db.Column(
        db.String(6),
        nullable=False
    )

    usado = db.Column(
        db.Boolean,
        default=False
    )

    fecha_creacion = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    fecha_expiracion = db.Column(
        db.DateTime,
        nullable=False
    )

    solicitud = db.relationship(
        "SolicitudRegistro"
    )