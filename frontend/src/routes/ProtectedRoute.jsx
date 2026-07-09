import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {

    const token = localStorage.getItem("access_token");

    const usuarioTexto = localStorage.getItem("usuario");

    const usuario = usuarioTexto
        ? JSON.parse(usuarioTexto)
        : null;

    // No autenticado
    if (!token || !usuario) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    // No autorizado
    if (
        roles &&
        !roles.includes(usuario.rol)
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    return children;

}

export default ProtectedRoute;