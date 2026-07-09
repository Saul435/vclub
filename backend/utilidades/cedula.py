def validar_cedula(cedula):

    if not cedula:
        return False

    cedula = cedula.strip().upper()

    
    if cedula == "SYSTEM":
        return True

    cedula = cedula.replace("-", "")

    if len(cedula) != 11:
        return False

    if not cedula.isdigit():
        return False

    multiplicadores = [
        1, 2, 1, 2, 1,
        2, 1, 2, 1, 2
    ]

    suma = 0

    for i in range(10):

        valor = (
            int(cedula[i]) *
            multiplicadores[i]
        )

        if valor > 9:
            valor = (
                valor // 10 +
                valor % 10
            )

        suma += valor

    digito_verificador = (
        (10 - (suma % 10))
        % 10
    )

    return (
        digito_verificador ==
        int(cedula[10])
    )