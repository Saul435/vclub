export function soloLetras(valor) {

    return valor.replace(
        /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
        ""
    );

}

export function soloNumeros(valor) {

    return valor.replace(
        /\D/g,
        ""
    );

}

export function limpiarTexto(valor) {

    return valor.replace(
        /[<>{}[\]|\\`~^$%]/g,
        ""
    );

}