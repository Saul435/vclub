import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import Solicitudes from "@/pages/Solicitudes";
import Usuarios from "@/pages/Usuarios";
import RegisterGoogle from "@/pages/RegisterGoogle";

import Dashboard from "@/pages/Dashboard";
import TiposArticulo from "@/pages/TiposArticulo";
import Generos from "@/pages/Generos";
import Idiomas from "@/pages/Idiomas";
import Elencos from "@/pages/Elenco";
import Clientes from "@/pages/Clientes";
import Empleados from "@/pages/Empleados";
import DescripcionArticulos from "@/pages/DescripcionArticulos";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
            path="/register-google"
            element={<RegisterGoogle />}
        />

        <Route
          path="/verificar-correo"
          element={<VerifyEmail />}
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tipos-articulo"
            element={<TiposArticulo />}
          />

          <Route
            path="/generos"
            element={<Generos />}
          />

          <Route
            path="/idiomas"
            element={<Idiomas />}
          />

          <Route
            path="/elencos"
            element={<Elencos />}
          />

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          <Route
            path="/empleados"
            element={<Empleados />}
          />

          <Route
            path="/descripciones-articulo"
            element={<DescripcionArticulos />}
          />

          {/* ADMINISTRACIÓN */}

          <Route
            path="/solicitudes"
            element={
              <ProtectedRoute
                roles={[
                  "Administrador"
                ]}
              >
                <Solicitudes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <ProtectedRoute
                roles={[
                  "Administrador"
                ]}
              >
                <Usuarios />
              </ProtectedRoute>
            }
          />

        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;