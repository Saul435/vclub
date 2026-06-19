import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Film, Users, Languages, UserCog } from "lucide-react";

import TiposArticulo from "./pages/TiposArticulo";
import Generos from "./pages/Generos";
import Idiomas from "./pages/Idiomas";
import Elencos from "./pages/Elenco";
import Clientes from "./pages/Clientes";
import Empleados from "./pages/Empleados";
import DescripcionArticulos from "./pages/DescripcionArticulos";

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen bg-zinc-950 text-white flex">

        <aside className="w-72 bg-black border-r border-zinc-800 p-5">

          <h1 className="text-3xl text-red-600 mb-8">
            VIDEO CLUB
          </h1>

          <nav className="flex flex-col gap-3">

            <Link className="menu-item" to="/tipos-articulo">
              <Film size={18}/>
              Tipos Artículo
            </Link>

            <Link className="menu-item" to="/generos">
              <Film size={18}/>
              Géneros
            </Link>

            <Link className="menu-item" to="/idiomas">
              <Languages size={18}/>
              Idiomas
            </Link>

            <Link className="menu-item" to="/elencos">
              <Users size={18}/>
              Elencos
            </Link>

            <Link className="menu-item" to="/clientes">
              <Users size={18}/>
              Clientes
            </Link>

            <Link className="menu-item" to="/empleados">
              <UserCog size={18}/>
              Empleados
            </Link>

            <Link className="menu-item" to="/descripciones-articulo">
              <Film size={18}/>
              Artículos
            </Link>

          </nav>

        </aside>

        <main className="flex-1 p-8">

          <Routes>

            <Route path="/" element={<TiposArticulo />} />
            <Route path="/tipos-articulo" element={<TiposArticulo />} />
            <Route path="/generos" element={<Generos />} />
            <Route path="/idiomas" element={<Idiomas />} />
            <Route path="/elencos" element={<Elencos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/descripciones-articulo" element={<DescripcionArticulos />} />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;