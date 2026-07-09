import { Navigate } from "react-router-dom";

function ProtectedRoute({ usuario, roles, children }) {

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (!roles.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;