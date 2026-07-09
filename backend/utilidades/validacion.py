import re


def solo_numeros(valor):

    if valor is None:
        return False

    return bool(
        re.fullmatch(
            r"\d+",
            str(valor)
        )
    )


def solo_letras(valor):

    if valor is None:
        return False

    return bool(
        re.fullmatch(
            r"[A-Za-zÁÉÍÓÚáéíóúÑñ ]+",
            valor.strip()
        )
    )


def texto_seguro(valor):

    if valor is None:
        return False

    return bool(
        re.fullmatch(
            r"[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,@#()\-_/]+",
            valor.strip()
        )
    )


def longitud(valor, minimo, maximo):

    if valor is None:
        return False


    valor = valor.strip()


    if not valor:
        return False


    return minimo <= len(valor) <= maximo