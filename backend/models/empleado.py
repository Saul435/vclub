from database import db

class Empleado(db.Model):
    __tablename__ = "empleados"

    id = db.Column(db.Integer, primary_key=True)

    nombre = db.Column(
        db.String(150),
        nullable=False
    )

    cedula = db.Column(
        db.String(20),
        nullable=False
    )

    tanda_labor = db.Column(
        db.String(20),
        nullable=False
    )

    porciento_comision = db.Column(
        db.Float,
        nullable=False
    )

    fecha_ingreso = db.Column(
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
            "tanda_labor": self.tanda_labor,
            "porciento_comision": self.porciento_comision,
            "fecha_ingreso": self.fecha_ingreso,
            "estado": self.estado
        }