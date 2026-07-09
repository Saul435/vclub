import api from "./api";

/* ==========================
   SOLICITUDES
========================== */

export async function obtenerSolicitudes() {

    const { data } = await api.get(
        "/admin/solicitudes"
    );

    return data;

}

export async function aprobarSolicitud(id) {

    const { data } = await api.post(
        `/admin/solicitudes/${id}/aprobar`,
        {}
    );

    return data;

}

export async function rechazarSolicitud(id, motivo) {

    const { data } = await api.post(
        `/admin/solicitudes/${id}/rechazar`,
        { motivo }
    );

    return data;

}


/* ==========================
   USUARIOS
========================== */

export async function obtenerUsuarios() {

    const { data } = await api.get(
        "/admin/usuarios"
    );

    return data;

}

export async function crearUsuario(usuario) {

    const { data } = await api.post(
        "/admin/usuarios",
        usuario
    );

    return data;

}

export async function editarUsuario(id, usuario) {

    const { data } = await api.put(
        `/admin/usuarios/${id}`,
        usuario
    );

    return data;

}

export async function cambiarEstadoUsuario(id) {

    const { data } = await api.put(
        `/admin/usuarios/${id}/estado`
    );

    return data;

}

export async function eliminarUsuario(id) {

    const { data } = await api.delete(
        `/admin/usuarios/${id}`
    );

    return data;

}


/* ==========================
   ACTIVIDADES
========================== */

export async function obtenerActividades() {

    const { data } = await api.get(
        "/admin/actividades"
    );

    return data;

}