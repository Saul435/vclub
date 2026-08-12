from database import db


class Reserva(db.Model):

    __tablename__ = "reservas"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    cliente_id = db.Column(
        db.Integer,
        db.ForeignKey("clientes.id"),
        nullable=False
    )

    descripcion_articulo_id = db.Column(
        db.Integer,
        db.ForeignKey("descripciones_articulo.id"),
        nullable=False
    )

    fecha_reserva = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    estado = db.Column(
        db.Boolean,
        default=True
    )

    cliente = db.relationship(
        "Cliente"
    )

    descripcion_articulo = db.relationship(
        "DescripcionArticulo"
    )

    def to_dict(self):

        return {

            "id": self.id,

            "cliente_id":
                self.cliente_id,

            "cliente":
                self.cliente.nombre,

            "descripcion_articulo_id":
                self.descripcion_articulo_id,

            "titulo":
                self.descripcion_articulo.titulo,

            "fecha_reserva":
                self.fecha_reserva,

            "estado":
                self.estado

        }