from database import db

class DescripcionArticulo(db.Model):
    __tablename__ = "descripciones_articulo"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    titulo = db.Column(
        db.String(200),
        nullable=False
    )

    tipo_articulo_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "tipos_articulo.id"
        ),
        nullable=False
    )

    idioma_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "idiomas.id"
        ),
        nullable=False
    )

    renta_dia = db.Column(
        db.Float,
        nullable=False
    )

    dias_renta = db.Column(
        db.Integer,
        nullable=False
    )

    monto_entrega_tardia = db.Column(
        db.Float,
        nullable=False
    )

    estado = db.Column(
        db.Boolean,
        default=True
    )

    tipo_articulo = db.relationship(
        "TipoArticulo"
    )

    idioma = db.relationship(
        "Idioma"
    )

    def to_dict(self):

        return {
            "id": self.id,
            "titulo": self.titulo,
            "tipo_articulo_id":
                self.tipo_articulo_id,
            "tipo_articulo":
                self.tipo_articulo.descripcion,
            "idioma_id":
                self.idioma_id,
            "idioma":
                self.idioma.descripcion,
            "renta_dia":
                self.renta_dia,
            "dias_renta":
                self.dias_renta,
            "monto_entrega_tardia":
                self.monto_entrega_tardia,
            "estado":
                self.estado
        }