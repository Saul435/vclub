import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Film, Users, Languages, UserCog } from "lucide-react";

import { useState } from "react";

import TiposArticulo from "./pages/TiposArticulo";
import Generos from "./pages/Generos";
import Idiomas from "./pages/Idiomas";
import Elencos from "./pages/Elenco";
import Clientes from "./pages/Clientes";
import Empleados from "./pages/Empleados";
import DescripcionArticulos from "./pages/DescripcionArticulos";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const [usuario, setUsuario] = useState(

    JSON.parse(

      localStorage.getItem("usuario")

    )

  );
  const rol = usuario?.rol;


  if (!usuario) {
    return <Login setUsuario={setUsuario} />;
  }

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-zinc-950 text-white flex">

        <aside className="w-72 bg-black border-r border-zinc-800 p-5">

          <h1 className="text-3xl text-red-600 mb-8">
            VIDEO CLUB
          </h1>

          <p className="text-sm text-zinc-400">
            {usuario.correo}
          </p>

          <p className="text-green-400 mb-6">
            {usuario.rol}
          </p>

          <nav className="flex flex-col gap-3">

            <Link className="menu-item" to="/tipos-articulo">
              <Film size={18} />
              Tipos Artículo
            </Link>

            {rol === "Administrador" && (
              <Link className="menu-item" to="/generos">
                <Film size={18} />
                Géneros
              </Link>
            )}

            {rol === "Administrador" && (
              <Link className="menu-item" to="/idiomas">
                <Languages size={18} />
                Idiomas
              </Link>

            )}

            <Link className="menu-item" to="/elencos">
              <Users size={18} />
              Elencos
            </Link>

            <Link className="menu-item" to="/clientes">
                <Users size={18} />
                Clientes
            </Link>

            

            {rol === "Administrador" && (
              <Link className="menu-item" to="/empleados">
                <UserCog size={18} />
                Empleados
              </Link>

            )}

            <Link className="menu-item" to="/descripciones-articulo">
              <Film size={18} />
              Artículos
            </Link>

            <button
              className="menu-item"
              onClick={() => {
                localStorage.removeItem("usuario");
                setUsuario(null);
              }}
            >
              Cerrar sesión
            </button>

          </nav>

        </aside>

        <main className="flex-1 p-8">

          <Routes>

            <Route path="/" element={<TiposArticulo />} />
            <Route path="/tipos-articulo" element={<TiposArticulo />} />
            <Route path="/generos" element={
              <ProtectedRoute
                usuario={usuario}
                roles={["Administrador"]}
              > <Generos />
              </ProtectedRoute>} />
            <Route path="/idiomas" element={
              <ProtectedRoute
                usuario={usuario}
                roles={["Administrador"]}
              > <Idiomas />
              </ProtectedRoute>} />
            <Route path="/elencos" element={<Elencos />} />
            <Route
              path="/clientes"
              element={
                <ProtectedRoute
                  usuario={usuario}
                  roles={["Administrador", "Empleado"]}
                >
                  <Clientes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empleados"
              element={
                <ProtectedRoute
                  usuario={usuario}
                  roles={["Administrador"]}
                >
                  <Empleados />
                </ProtectedRoute>
              }
            />
            <Route path="/descripciones-articulo" element={<DescripcionArticulos />} />
            <Route path="/login" element={<Login />} />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;
