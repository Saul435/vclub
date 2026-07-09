from flask import Blueprint, request, jsonify
from flask_jwt_extended import ( jwt_required, get_jwt_identity )
from utilidades.decorators import admin_required

from models.rol import Rol
from models.usuario import Usuario
from models.cliente import Cliente
from models.idioma import Idioma
from models.genero import Genero
from models.tipo_articulo import TipoArticulo
from models.elenco import Elenco
from models.descripcion_articulo import DescripcionArticulo
from models.rol import Rol


busqueda_bp = Blueprint(
    "busqueda",
    __name__
)


@busqueda_bp.route(
    "/busqueda",
    methods=["GET"]
)
@jwt_required()
@admin_required()
def buscar():

    texto = request.args.get(
        "q",
        ""
    ).strip()

    usuario_actual = Usuario.query.get(
        int(get_jwt_identity())
    )


    puede_ver_usuarios = (

        usuario_actual
        and
        usuario_actual.rol
        and
        usuario_actual.rol.nombre == "Administrador"

    )
    

    if len(texto) < 2:

        return jsonify([])

    resultados = []


    # =========================
    # Usuarios
    # =========================

        # =========================
    # Usuarios
    # Solo Administradores
    # =========================

    if puede_ver_usuarios:

        usuarios = Usuario.query.filter(

            Usuario.rol.has(
                Rol.nombre!="Administrador"
            ),

            (
                (Usuario.nombre.ilike(f"%{texto}%")) |

                (Usuario.apellido.ilike(f"%{texto}%")) |

                (Usuario.correo.ilike(f"%{texto}%"))
            )

        ).limit(5).all()


        for usuario in usuarios:

            resultados.append({

                "tipo": "Usuario",

                "id": usuario.id,

                "titulo": f"{usuario.nombre} {usuario.apellido}",

                "ruta": "/usuarios"

            })


    # =========================
    # Clientes
    # =========================

    clientes = Cliente.query.filter(

        Cliente.nombre.ilike(f"%{texto}%")

    ).limit(5).all()

    for cliente in clientes:

        resultados.append({

            "tipo": "Cliente",

            "id": cliente.id,

            "titulo": cliente.nombre,

            "ruta": "/clientes"

        })


    # =========================
    # Idiomas
    # =========================

    idiomas = Idioma.query.filter(

        Idioma.descripcion.ilike(f"%{texto}%")

    ).limit(5).all()

    for idioma in idiomas:

        resultados.append({

            "tipo": "Idioma",

            "id": idioma.id,

            "titulo": idioma.descripcion,

            "ruta": "/idiomas"

        })


    # =========================
    # Géneros
    # =========================

    generos = Genero.query.filter(

        Genero.descripcion.ilike(f"%{texto}%")

    ).limit(5).all()

    for genero in generos:

        resultados.append({

            "tipo": "Género",

            "id": genero.id,

            "titulo": genero.descripcion,

            "ruta": "/generos"

        })


    # =========================
    # Tipos
    # =========================

    tipos = TipoArticulo.query.filter(

        TipoArticulo.descripcion.ilike(f"%{texto}%")

    ).limit(5).all()

    for tipo in tipos:

        resultados.append({

            "tipo": "Tipo",

            "id": tipo.id,

            "titulo": tipo.descripcion,

            "ruta": "/tipos-articulo"

        })


    # =========================
    # Elencos
    # =========================

    elencos = Elenco.query.filter(

        Elenco.nombre.ilike(f"%{texto}%")

    ).limit(5).all()

    for elenco in elencos:

        resultados.append({

            "tipo": "Elenco",

            "id": elenco.id,

            "titulo": elenco.nombre,

            "ruta": "/elencos"

        })


    # =========================
    # Artículos
    # =========================

    articulos = DescripcionArticulo.query.filter(

        DescripcionArticulo.titulo.ilike(f"%{texto}%")

    ).limit(5).all()

    for articulo in articulos:

        resultados.append({

            "tipo": "Artículo",

            "id": articulo.id,

            "titulo": articulo.titulo,

            "ruta": "/descripciones-articulo"

        })


    return jsonify(resultados)