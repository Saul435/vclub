import {

    LayoutDashboard,

    Film,

    Users,

    Languages,

    Tags,

    Clapperboard,

    ClipboardList,

    Shield,

    LogOut

} from "lucide-react";

import Logo from "./Logo";
import NavItem from "./NavItem";

import { useAuth } from "@/context/AuthContext";

function Sidebar() {

    const { usuario, logout  } = useAuth();

    const esAdmin =
        usuario?.rol === "Administrador";

    return (

        <aside className="hidden w-72 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex">

            <div className="p-6">

                <Logo />

                <div className="mt-8 space-y-8">

                    {/* GENERAL */}

                    <div>

                        <p className="mb-3 px-2 text-xs uppercase tracking-widest text-zinc-500">

                            General

                        </p>

                        <div className="space-y-2">

                            <NavItem
                                to="/dashboard"
                                icon={LayoutDashboard}
                            >
                                Dashboard
                            </NavItem>

                        </div>

                    </div>

                    {/* ADMINISTRACIÓN */}

                    {esAdmin && (

                        <div>

                            <p className="mb-3 px-2 text-xs uppercase tracking-widest text-zinc-500">

                                Administración

                            </p>

                            <div className="space-y-2">

                                <NavItem
                                    to="/solicitudes"
                                    icon={ClipboardList}
                                >
                                    Solicitudes
                                </NavItem>

                                <NavItem
                                    to="/usuarios"
                                    icon={Shield}
                                >
                                    Usuarios
                                </NavItem>

                            </div>

                        </div>

                    )}

                    {/* CATÁLOGOS */}

                    <div>

                        <p className="mb-3 px-2 text-xs uppercase tracking-widest text-zinc-500">

                            Catálogos

                        </p>

                        <div className="space-y-2">

                            <NavItem
                                to="/tipos-articulo"
                                icon={Tags}
                            >
                                Tipos
                            </NavItem>

                            <NavItem
                                to="/generos"
                                icon={Film}
                            >
                                Géneros
                            </NavItem>

                            <NavItem
                                to="/idiomas"
                                icon={Languages}
                            >
                                Idiomas
                            </NavItem>

                        </div>

                    </div>

                    {/* PERSONAS */}

                    <div>

                        <p className="mb-3 px-2 text-xs uppercase tracking-widest text-zinc-500">

                            Personas

                        </p>

                        <div className="space-y-2">

                            <NavItem
                                to="/clientes"
                                icon={Users}
                            >
                                Clientes
                            </NavItem>

                            <NavItem
                                to="/elencos"
                                icon={Clapperboard}
                            >
                                Elencos
                            </NavItem>

                        </div>

                    </div>

                    {/* INVENTARIO */}

                    <div>

                        <p className="mb-3 px-2 text-xs uppercase tracking-widest text-zinc-500">

                            Inventario

                        </p>

                        <div className="space-y-2">

                            <NavItem
                                to="/descripciones-articulo"
                                icon={Film}
                            >
                                Artículos
                            </NavItem>

                        </div>

                    </div>

                </div>

            </div>

            <div className="mt-auto border-t border-zinc-800 p-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 font-bold">

                        {usuario?.nombre?.charAt(0)}

                    </div>

                    <div>

                        <p className="font-medium">

                            {usuario?.nombre} {usuario?.apellido}

                        </p>

                        <p className="text-sm text-zinc-500">

                            {usuario?.rol}

                        </p>




                    </div>

                </div>

                 <button

                    onClick={logout}

                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-600 py-3 text-red-500 transition hover:bg-red-600 hover:text-white"

                >

                    <LogOut size={18} />

                    Cerrar sesión

                </button>

            </div>

        </aside>

    );

}

export default Sidebar;