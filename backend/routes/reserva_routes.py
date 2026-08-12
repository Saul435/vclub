from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from database import db

from models.reserva import Reserva
from models.cliente import Cliente
from models.descripcion_articulo import DescripcionArticulo
from flask import send_file
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO


reserva_bp = Blueprint(
    "reserva",
    __name__
)


@reserva_bp.route(
    "/reservas",
    methods=["GET"]
)
@jwt_required()
def get_reservas():

    reservas = Reserva.query.all()

    return jsonify([

        r.to_dict()

        for r in reservas

    ])


@reserva_bp.route(
    "/reservas/cliente/<cedula>",
    methods=["GET"]
)
@jwt_required()
def buscar_cliente(cedula):

    cliente = Cliente.query.filter_by(
        cedula=cedula
    ).first()

    if not cliente:

        return jsonify({
            "error":
            "Cliente no encontrado."
        }), 404

    if not cliente.estado:

        return jsonify({
            "error":
            "El cliente está inactivo."
        }), 400

    return jsonify(
        cliente.to_dict()
    )

@reserva_bp.route(
    "/reservas",
    methods=["POST"]
)
@jwt_required()
def crear_reserva():

    data = request.json or {}

    cliente_id = data.get(
        "cliente_id"
    )

    descripcion_articulo_id = data.get(
        "descripcion_articulo_id"
    )

    cliente = Cliente.query.get(
        cliente_id
    )

    if not cliente:

        return jsonify({
            "error":
            "El cliente no existe."
        }), 400

    if not cliente.estado:

        return jsonify({
            "error":
            "El cliente está inactivo."
        }), 400


    articulo = DescripcionArticulo.query.get(
        descripcion_articulo_id
    )

    if not articulo:

        return jsonify({
            "error":
            "El artículo no existe."
        }), 400


    if not articulo.estado:

        return jsonify({
            "error":
            "El artículo está inactivo."
        }), 400


    reservas_activas = Reserva.query.filter_by(

        descripcion_articulo_id=
            descripcion_articulo_id,

        estado=True

    ).count()


    if reservas_activas >= articulo.unidades:

        return jsonify({
            "error":
            "No hay unidades disponibles."
        }), 400


    reserva_cliente = Reserva.query.filter_by(

        cliente_id=cliente_id,

        descripcion_articulo_id=
            descripcion_articulo_id,

        estado=True

    ).first()


    if reserva_cliente:

        return jsonify({
            "error":
            "Este cliente ya tiene una reserva de este artículo."
        }), 400


    nueva = Reserva(

        cliente_id=cliente_id,

        descripcion_articulo_id=
            descripcion_articulo_id,

        estado=True

    )


    db.session.add(nueva)

    db.session.commit()


    return jsonify(
        nueva.to_dict()
    ), 201

@reserva_bp.route(
    "/reservas/<int:id>/estado",
    methods=["PUT"]
)
@jwt_required()
def cambiar_estado_reserva(id):

    reserva = Reserva.query.get_or_404(id)

    reserva.estado = not reserva.estado

    db.session.commit()

    return jsonify(
        reserva.to_dict()
    )

@reserva_bp.route(
    "/reservas/reporte",
    methods=["GET"]
)
@jwt_required()
def generar_reporte():

    reservas = Reserva.query.all()

    buffer = BytesIO()

    pdf = canvas.Canvas(
        buffer,
        pagesize=letter
    )

    ancho, alto = letter

    # =========================
    # ENCABEZADO
    # =========================

    pdf.setFont(
        "Helvetica-Bold",
        18
    )

    pdf.drawString(
        50,
        alto - 50,
        "Reporte de Reservas"
    )

    pdf.setFont(
        "Helvetica",
        10
    )

    pdf.drawString(
        50,
        alto - 70,
        "Sistema Video Club"
    )

    y = alto - 110

    # =========================
    # ENCABEZADOS
    # =========================

    pdf.setFont(
        "Helvetica-Bold",
        10
    )

    pdf.drawString(50, y, "ID")
    pdf.drawString(80, y, "Cliente")
    pdf.drawString(220, y, "Artículo")
    pdf.drawString(380, y, "Fecha")
    pdf.drawString(480, y, "Estado")

    y -= 20

    pdf.setFont(
        "Helvetica",
        9
    )

    for reserva in reservas:

        if y < 50:

            pdf.showPage()

            y = alto - 50

            pdf.setFont(
                "Helvetica",
                9
            )

        cliente = reserva.cliente.nombre

        articulo = (
            reserva.descripcion_articulo.titulo
        )

        fecha = (
            reserva.fecha_reserva.strftime(
                "%d/%m/%Y %H:%M"
            )
            if reserva.fecha_reserva
            else "-"
        )

        estado = (
            "Reservado"
            if reserva.estado
            else "Devuelto"
        )

        pdf.drawString(
            50,
            y,
            str(reserva.id)
        )

        pdf.drawString(
            80,
            y,
            cliente[:22]
        )

        pdf.drawString(
            220,
            y,
            articulo[:25]
        )

        pdf.drawString(
            380,
            y,
            fecha
        )

        pdf.drawString(
            480,
            y,
            estado
        )

        y -= 18

    # =========================
    # FINALIZAR PDF
    # =========================

    pdf.save()

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="reporte_reservas.pdf",
        mimetype="application/pdf"
    )