import { useEffect, useState } from "react";

import {
    Film,
    Users,
    UserCog,
    Languages,
    Plus,
    UserPlus,
    Clapperboard,
    Activity
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import StatCard from "@/components/dashboard/StatCard";
import QuickAction from "@/components/dashboard/QuickAction";
import { obtenerDashboard } from "@/services/dashboardService";

import { useNavigate } from "react-router-dom";



function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({

        estadisticas: {

            peliculas: 0,
            clientes: 0,
            empleados: 0,
            idiomas: 0

        },

        actividades: []

    });

    useEffect(() => {

        cargar();

    }, []);

    const cargar = async () => {

        try {

            const data = await obtenerDashboard();

            setDashboard(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    return (

        <motion.div

            initial={{
                opacity: 0
            }}

            animate={{
                opacity: 1
            }}

            className="space-y-8"

        >

            {/* HEADER */}

            <div>

                <h1 className="text-3xl font-bold">

                    Panel de control

                </h1>

                <p className="mt-2 text-zinc-400">

                    Resumen general del sistema

                </p>

            </div>

            {/* STATS */}

            <div
                className="
                grid
                gap-6
                sm:grid-cols-2
                xl:grid-cols-4
            "
            >
              
                <StatCard

                    title="Películas"

                    value={dashboard.estadisticas.peliculas}

                    description="Total registradas"

                    icon={Film}

                    color="red"

                />
                

                <StatCard

                    title="Clientes"

                    value={dashboard.estadisticas.clientes}

                    description="Clientes activos"

                    icon={Users}

                    color="blue"

                />

                <StatCard

                    title="Empleados"

                    value={dashboard.estadisticas.empleados}

                    description="Usuarios del sistema"

                    icon={UserCog}

                    color="green"

                />

                <StatCard

                    title="Idiomas"

                    value={dashboard.estadisticas.idiomas}

                    description="Disponibles"

                    icon={Languages}

                    color="purple"

                />

            </div>

            {/* ACCIONES */}

            <div>

                <h2 className="mb-4 text-xl font-semibold">

                    Acciones rápidas

                </h2>

                <div
                    className="
                    grid
                    gap-5
                    md:grid-cols-3
                "
                >

                    <QuickAction

                        title="Nuevo cliente"

                        description="Registrar un cliente"

                        icon={UserPlus}

                        onClick={() => navigate("/clientes")}

                    />

                    <QuickAction

                        title="Nueva película"

                        description="Agregar al catálogo"

                        icon={Plus}

                        onClick={() => navigate("/descripciones-articulo")}

                    />

                    <QuickAction

                        title="Nuevo artículo"

                        description="Crear registro"

                        icon={Clapperboard}

                        onClick={() => navigate("/tipos-articulo")}

                    />

                </div>

            </div>

            {/* ACTIVIDAD */}

            <div>

                <h2
                    className="
                    mb-4
                    flex
                    items-center
                    gap-2
                    text-xl
                    font-semibold
                "
                >

                    <Activity size={22} />

                    Actividad reciente

                </h2>

                <div className="space-y-3">

                    {

                        dashboard.actividades.length > 0

                            ?

                            dashboard.actividades.map((item, index) => (

                                <motion.div

                                    key={item.id ?? index}

                                    initial={{
                                        opacity: 0,
                                        x: -10
                                    }}

                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}

                                    transition={{
                                        delay: index * .08
                                    }}

                                    className="
                                        flex
                                        justify-between
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-zinc-900
                                        p-4
                                    "

                                >

                                    <div>

                                        <p className="font-medium">

                                            {item.accion}

                                        </p>

                                        <p className="text-sm text-zinc-400 mt-1">

                                            {item.descripcion}

                                        </p>

                                    </div>

                                    <span
                                        className="
                                        text-sm
                                        text-zinc-500
                                        whitespace-nowrap
                                        ml-4
                                    "
                                    >

                                        {

                                            new Date(

                                                item.fecha

                                            ).toLocaleString()

                                        }

                                    </span>

                                </motion.div>

                            ))

                            :

                            <div
                                className="
                                rounded-xl
                                border
                                border-zinc-800
                                bg-zinc-900
                                p-6
                                text-center
                                text-zinc-500
                            "
                            >

                                No hay actividad reciente.

                            </div>

                    }

                </div>

            </div>

        </motion.div>

    );

}

export default Dashboard;