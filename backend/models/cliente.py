from database import db

class Cliente(db.Model):
    __tablename__ = "clientes"

    id = db.Column(db.Integer, primary_key=True)

    nombre = db.Column(db.String(150), nullable=False)

    cedula = db.Column(
        db.String(20),
        nullable=False
    )

    tarjeta_credito = db.Column(
        db.String(30),
        nullable=False
    )

    limite_credito = db.Column(
        db.Float,
        nullable=False
    )

    tipo_persona = db.Column(
        db.String(20),
        nullable=False
    )

    estado = db.Column(
        db.Boolean,
        default=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "cedula": self.cedula,
            "tarjeta_credito": self.tarjeta_credito,
            "limite_credito": self.limite_credito,
            "tipo_persona": self.tipo_persona,
            "estado": self.estado
        }