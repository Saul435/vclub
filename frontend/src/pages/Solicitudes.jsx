import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import {
    User,
    Mail,
    BadgeCheck,
    Search,
    CheckCircle,
    XCircle
} from "lucide-react";

import { obtenerSolicitudes, aprobarSolicitud, rechazarSolicitud } from "@/services/adminService";

function Solicitudes() {

    const [solicitudes, setSolicitudes] = useState([]);

    const [busqueda, setBusqueda] = useState("");

    const [loading, setLoading] = useState(true);

    const [modalAprobar, setModalAprobar] = useState(null);

    const [modalRechazar, setModalRechazar] = useState(null);

    const [motivo, setMotivo] = useState("");



    useEffect(() => {

        cargarSolicitudes();

    }, []);



    async function cargarSolicitudes() {

        try {

            const data = await obtenerSolicitudes();

            setSolicitudes(data);

        }

      catch (error) {

    console.log(error);

    console.log(error.response);

    console.log(error.response?.data);

    toast.error("No fue posible cargar las solicitudes.");

}

        finally {

            setLoading(false);

        }

    }



    async function aprobar() {

        try {

            await aprobarSolicitud(
                modalAprobar.id
            );

            toast.success("Solicitud aprobada.");

            setSolicitudes(

                solicitudes.filter(

                    s => s.id !== modalAprobar.id

                )

            );

            setModalAprobar(null);

        }

        catch (error) {

            toast.error(

                error.response?.data?.error ||

                "Error."

            );

        }

    }



    async function rechazar() {

        try {


            await rechazarSolicitud(
                modalRechazar.id,
                motivo
            );

            toast.success("Solicitud rechazada.");

            setSolicitudes(

                solicitudes.filter(

                    s => s.id !== modalRechazar.id

                )

            );

            setModalRechazar(null);

            setMotivo("");

        }

        catch (error) {

            toast.error(

                error.response?.data?.error ||

                "Error."

            );

        }

    }



    const lista = solicitudes.filter(s =>

        `${s.nombre} ${s.apellido} ${s.correo}`

            .toLowerCase()

            .includes(

                busqueda.toLowerCase()

            )

    );



    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">

                    Solicitudes

                </h1>

                <p className="mt-2 text-zinc-400">

                    Solicitudes pendientes de aprobación

                </p>

            </div>



            {/* <div className="relative">

                <Search

                    className="absolute left-4 top-3.5 text-zinc-500"

                    size={18}

                />

                <input

                    value={busqueda}

                    onChange={(e)=>

                        setBusqueda(

                            e.target.value

                        )

                    }

                    placeholder="Buscar..."

                    className="

                    w-full

                    rounded-xl

                    border

                    border-zinc-800

                    bg-zinc-900

                    py-3

                    pl-11

                    outline-none

                    focus:border-red-500

                    "

                />

            </div> */}



            {

                loading ?

                <p>Cargando...</p>

                :

                <div className="space-y-5">

                    {

                        lista.length===0 &&

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-500">

                            No existen solicitudes.

                        </div>

                    }

                    {

                        lista.map((s,index)=>(

                            <motion.div

                                key={s.id}

                                initial={{

                                    opacity:0,

                                    y:15

                                }}

                                animate={{

                                    opacity:1,

                                    y:0

                                }}

                                transition={{

                                    delay:index*.05

                                }}

                                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"

                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold">

                                            {s.nombre} {s.apellido}

                                        </h2>

                                        <div className="mt-2 flex items-center gap-2 text-zinc-400">

                                            <Mail size={16}/>

                                            {s.correo}

                                        </div>

                                        <div className="mt-2 flex items-center gap-2 text-zinc-400">

                                            <User size={16}/>

                                            {s.cedula}

                                        </div>

                                        <div className="mt-2 flex items-center gap-2 text-green-500">

                                            <BadgeCheck size={16}/>

                                            Correo verificado

                                        </div>

                                    </div>

                                    <div className="flex gap-3">

                                        <button

                                            onClick={()=>{

                                                setModalAprobar(s);

                                            }}

                                            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 hover:bg-green-700"

                                        >

                                            <CheckCircle size={18}/>

                                            Aprobar

                                        </button>

                                        <button

                                            onClick={()=>

                                                setModalRechazar(s)

                                            }

                                            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 hover:bg-red-700"

                                        >

                                            <XCircle size={18}/>

                                            Rechazar

                                        </button>

                                    </div>

                                </div>

                            </motion.div>

                        ))

                    }

                </div>

            }



            {

                modalAprobar &&

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

                    <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6">

                        <h2 className="text-xl font-bold">

                            Aprobar solicitud

                        </h2>

                        <div className="mt-6 flex justify-end gap-3">

                            <button

                                onClick={()=>

                                    setModalAprobar(null)

                                }

                            >

                                Cancelar

                            </button>

                            <button

                                onClick={aprobar}

                                className="rounded-xl bg-green-600 px-5 py-2"

                            >

                                Aprobar

                            </button>

                        </div>

                    </div>

                </div>

            }



            {

                modalRechazar &&

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

                    <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6">

                        <h2 className="text-xl font-bold">

                            Rechazar solicitud

                        </h2>

                        <textarea

                            rows={5}

                            value={motivo}

                            onChange={(e)=>

                                setMotivo(e.target.value)

                            }

                            placeholder="Motivo..."

                            className="mt-5 w-full rounded-xl bg-zinc-950 p-3 outline-none"

                        />

                        <div className="mt-6 flex justify-end gap-3">

                            <button

                                onClick={()=>{

                                    setModalRechazar(null);

                                    setMotivo("");

                                }}

                            >

                                Cancelar

                            </button>

                            <button

                                onClick={rechazar}

                                className="rounded-xl bg-red-600 px-5 py-2"

                            >

                                Rechazar

                            </button>

                        </div>

                    </div>

                </div>

            }

        </div>

    );

}

export default Solicitudes;