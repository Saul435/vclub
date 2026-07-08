from database import db

class TipoArticulo(db.Model):
    __tablename__ = "tipos_articulo"

    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion,
            "estado": self.estado
        }