from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utilidades.decorators import admin_required

from database import db
from models.cliente import Cliente
from utilidades.cedula import validar_cedula

from utilidades.validacion import ( solo_letras, solo_numeros, longitud )

cliente_bp = Blueprint(
    "cliente",
    __name__
)

@cliente_bp.route("/clientes", methods=["GET"])
@jwt_required()
def get_clientes():

    clientes = Cliente.query.all()

    return jsonify([
        c.to_dict()
        for c in clientes
    ])

@cliente_bp.route(
    "/clientes",
    methods=["POST"]
)
@jwt_required()
def create_cliente():

    data = request.json or {}


    nombre = data.get(
        "nombre",
        ""
    ).strip()


    cedula = data.get(
        "cedula",
        ""
    ).strip()


    tarjeta = data.get(
        "tarjeta_credito",
        ""
    ).strip()


    limite = data.get(
        "limite_credito",
        ""
    )


    tipo_persona = data.get(
        "tipo_persona",
        ""
    )



    # ======================
    # VALIDACIONES
    # ======================


    if not nombre:

        return jsonify({

            "message":
            "El nombre es obligatorio."

        }),400



    if not solo_letras(nombre):

        return jsonify({

            "message":
            "El nombre solo puede contener letras."

        }),400



    if not longitud(
        nombre,
        2,
        100
    ):

        return jsonify({

            "message":
            "El nombre debe tener entre 2 y 100 caracteres."

        }),400




    if not validar_cedula(cedula):

        return jsonify({

            "message":
            "La cédula es inválida."

        }),400





    if not solo_numeros(tarjeta):

        return jsonify({

            "message":
            "La tarjeta solo puede contener números."

        }),400



    if len(tarjeta) != 16:

        return jsonify({

            "message":
            "La tarjeta debe tener 16 dígitos."

        }),400




    try:

        limite = float(limite)

    except:

        return jsonify({

            "message":
            "El límite de crédito debe ser numérico."

        }),400




    if limite <= 0:

        return jsonify({

            "message":
            "El límite de crédito debe ser mayor a cero."

        }),400




    if tipo_persona not in [
        "Fisica",
        "Juridica"
    ]:

        return jsonify({

            "message":
            "Tipo de persona inválido."

        }),400





    existe = Cliente.query.filter_by(
        cedula=cedula
    ).first()



    if existe:

        return jsonify({

            "message":
            "Esta cédula ya existe."

        }),400






    nuevo = Cliente(

        nombre=nombre,

        cedula=cedula,

        tarjeta_credito=tarjeta,

        limite_credito=limite,

        tipo_persona=tipo_persona,

        estado=True

    )


    db.session.add(nuevo)

    db.session.commit()



    return jsonify(
        nuevo.to_dict()
    ),201



@cliente_bp.route(
    "/clientes/<int:id>",
    methods=["PUT"]
)
@jwt_required()
def update_cliente(id):

    cliente = Cliente.query.get_or_404(id)


    data = request.json or {}



    nombre = data.get(
        "nombre",
        ""
    ).strip()


    cedula = data.get(
        "cedula",
        ""
    ).strip()


    tarjeta = data.get(
        "tarjeta_credito",
        ""
    ).strip()


    limite = data.get(
        "limite_credito",
        ""
    )


    tipo_persona = data.get(
        "tipo_persona",
        ""
    )



    if not solo_letras(nombre):

        return jsonify({

            "message":
            "El nombre solo puede contener letras."

        }),400



    if not validar_cedula(cedula):

        return jsonify({

            "message":
            "La cédula es inválida."

        }),400




    if not solo_numeros(tarjeta):

        return jsonify({

            "message":
            "La tarjeta solo puede contener números."

        }),400




    if len(tarjeta) != 16:

        return jsonify({

            "message":
            "La tarjeta debe tener 16 dígitos."

        }),400




    try:

        limite=float(limite)

    except:

        return jsonify({

            "message":
            "Límite inválido."

        }),400




    if limite <= 0:

        return jsonify({

            "message":
            "El límite debe ser mayor a cero."

        }),400




    duplicado = Cliente.query.filter(

        Cliente.id != cliente.id,

        Cliente.cedula == cedula

    ).first()



    if duplicado:

        return jsonify({

            "message":
            "La cédula ya pertenece a otro cliente."

        }),400




    cliente.nombre = nombre

    cliente.cedula = cedula

    cliente.tarjeta_credito = tarjeta

    cliente.limite_credito = limite

    cliente.tipo_persona = tipo_persona



    db.session.commit()



    return jsonify(
        cliente.to_dict()
    )

@cliente_bp.route("/clientes/<int:id>/estado", methods=["PUT"])
@jwt_required()
@admin_required()
def cambiar_estado_cliente(id):

    cliente = Cliente.query.get_or_404(id)

    cliente.estado = not cliente.estado

    db.session.commit()

    return jsonify(
        cliente.to_dict()
    )

@cliente_bp.route( "/clientes/<int:id>", methods=["DELETE"])
@jwt_required()
@admin_required()
def delete_cliente(id):

    cliente = Cliente.query.get_or_404(id)

    db.session.delete(cliente)

    db.session.commit()

    return jsonify({
        "message":
        "Cliente eliminado correctamente"
    })