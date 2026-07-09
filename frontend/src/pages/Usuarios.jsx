import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import useHighlight from "@/services/useHighlight";

import {

    Search,
    Plus,
    Mail,
    Phone,
    BadgeCheck,
    Shield,
    User,
    Pencil,
    Trash2,
    Power

} from "lucide-react";

import { obtenerUsuarios, cambiarEstadoUsuario, eliminarUsuario, editarUsuario } from "@/services/adminService";

import { soloLetras, soloNumeros, limpiarTexto } from "@/services/validacion";



function Usuarios() {

    const highlightId = useHighlight();

    const [usuarios, setUsuarios] = useState([]);

    const [loading, setLoading] = useState(true);

    const [busqueda, setBusqueda] = useState("");

    const [filtro, setFiltro] = useState("Todos");

    const [modalEditar, setModalEditar] = useState(null);

    const [form, setForm] = useState({ nombre: "", apellido: "", cedula: "", telefono: "", correo: "" });



    useEffect(() => {

        cargarUsuarios();

    }, []);



    async function cargarUsuarios() {

        try {

            const data = await obtenerUsuarios();


            const visibles = data.filter(
                usuario => usuario.rol !== "Administrador"
            );


            setUsuarios(visibles);

        }

        catch {

            toast.error(

                "No fue posible cargar los usuarios."

            );

        }

        finally {

            setLoading(false);

        }

    }



    const lista = useMemo(() => {

        return usuarios.filter(usuario => {

            const coincideBusqueda =

                `${usuario.nombre} ${usuario.apellido} ${usuario.correo}`

                    .toLowerCase()

                    .includes(

                        busqueda.toLowerCase()

                    );



            const coincideFiltro =

                filtro === "Todos"

                ||

                usuario.rol === filtro;



            return coincideBusqueda && coincideFiltro;

        });

    }, [

        usuarios,

        busqueda,

        filtro

    ]);


    async function cambiarEstado(id) {

        try {

            await cambiarEstadoUsuario(id);

            toast.success("Estado actualizado.");

            cargarUsuarios();

        } catch (error) {

            toast.error(
                error.response?.data?.error ||
                "Error actualizando usuario."
            );

        }

    }



    async function eliminar(id) {

        if (!window.confirm("¿Eliminar usuario?")) return;

        try {

            await eliminarUsuario(id);

            toast.success("Usuario eliminado.");

            cargarUsuarios();

        } catch (error) {

            toast.error(
                error.response?.data?.error ||
                "Error eliminando usuario."
            );

        }

    }


    function abrirEditar(usuario) {

        setModalEditar(usuario);

        setForm({

            nombre: usuario.nombre,

            apellido: usuario.apellido,

            cedula: usuario.cedula,

            telefono: usuario.telefono || "",

            correo: usuario.correo

        });

    }




    async function guardarEdicion() {

        try {

            if (!form.nombre.trim()) {

    toast.error("Ingrese el nombre");

    return;

}

    if (!form.apellido.trim()) {

        toast.error("Ingrese el apellido");

        return;

    }

    /*if (form.cedula.length !== 11) {

        toast.error("La cédula debe tener 11 dígitos");

        return;

    }*/

    if (form.telefono.length < 10) {

        toast.error("Teléfono inválido");

        return;

    }

            await editarUsuario(

                modalEditar.id,

                form

            );

            toast.success(

                "Usuario actualizado."

            );

            setModalEditar(null);

            cargarUsuarios();

        }

        catch (error) {

            toast.error(

                error.response?.data?.error ||

                "No fue posible actualizar."

            );

        }

    }



    return (

        <div className="space-y-8">

            {/* HEADER */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Usuarios

                    </h1>

                    <p className="mt-2 text-zinc-400">

                        Administración de usuarios del sistema

                    </p>

                </div>

            </div>



            {/* BUSCADOR */}

            {/*<div className="relative">

                <Search

                    size={18}

                    className="absolute left-4 top-3.5 text-zinc-500"

                />

                <input

                    placeholder="Buscar usuario..."

                    value={busqueda}

                    onChange={(e)=>setBusqueda(e.target.value)}

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

            </div>*/}



            {/* FILTROS */}

            <div className="flex gap-3">

                {

                    [

                        "Todos",

                        "Administrador",

                        "Empleado"

                    ].map(item=>(

                        <button

                            key={item}

                            onClick={()=>setFiltro(item)}

                            className={`

                                rounded-xl

                                px-5

                                py-2

                                transition

                                ${

                                    filtro===item

                                    ?

                                    "bg-red-600"

                                    :

                                    "bg-zinc-900 hover:bg-zinc-800"

                                }

                            `}

                        >

                            {item}

                        </button>

                    ))

                }

            </div>



            {/* CONTENIDO */}

            {

                loading

                ?

                <p>Cargando...</p>

                :

                <div className="space-y-5">

                    {

                        lista.length===0 &&

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-500">

                            No existen usuarios.

                        </div>

                    }



                    {

                        lista.map((usuario,index)=>(

                            <motion.div

                                id={`item-${usuario.id}`}

                                key={usuario.id}

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

                                className={`
                                            rounded-2xl
                                            border
                                            p-6
                                            transition-all
                                            duration-700
                                            ${
                                                highlightId == usuario.id
                                                    ? "border-red-500 bg-red-950/30 shadow-lg shadow-red-500/30"
                                                    : "border-zinc-800 bg-zinc-900"
                                            }
                                        `}

                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold">

                                            {usuario.nombre} {usuario.apellido}

                                        </h2>



                                        <div className="mt-3 flex items-center gap-2 text-zinc-400">

                                            <Mail size={16}/>

                                            {usuario.correo}

                                        </div>



                                        <div className="mt-2 flex items-center gap-2 text-zinc-400">

                                            <Phone size={16}/>

                                            {usuario.telefono || "Sin teléfono"}

                                        </div>



                                        <div className="mt-2 flex items-center gap-2">

                                            <Shield

                                                size={16}

                                                className="text-blue-400"

                                            />

                                            <span>

                                                {usuario.rol}

                                            </span>

                                        </div>



                                        <div className="mt-2 flex items-center gap-2">

                                            <BadgeCheck

                                                size={16}

                                                className={

                                                    usuario.activo

                                                    ?

                                                    "text-green-500"

                                                    :

                                                    "text-red-500"

                                                }

                                            />

                                            {

                                                usuario.activo

                                                ?

                                                "Activo"

                                                :

                                                "Inactivo"

                                            }

                                        </div>

                                    </div>



                                    <div className="flex gap-3">

                                        <button

                                            onClick={() =>

                                                abrirEditar(usuario)

                                            }

                                            className="rounded-xl bg-blue-600 p-3 hover:bg-blue-700"

                                        >

                                            <Pencil size={18}/>

                                        </button>



                                        <button

                                            onClick={() =>

                                                cambiarEstado(usuario.id)

                                            }

                                            className="rounded-xl bg-yellow-600 p-3 hover:bg-yellow-700"

                                        >

                                            <Power size={18}/>

                                        </button>



                                        <button

                                            onClick={() =>

                                                eliminar(usuario.id)

                                            }

                                            className="rounded-xl bg-red-600 p-3 hover:bg-red-700"

                                        >

                                            <Trash2 size={18}/>

                                        </button>

                                    </div>

                                </div>

                            </motion.div>

                        ))

                    }

                </div>

            }


            {
                modalEditar &&

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

                    <div className="w-full max-w-lg rounded-2xl bg-zinc-900 p-6">

                        <h2 className="text-2xl font-bold">

                            Editar usuario

                        </h2>

                        <div className="mt-6 space-y-4">

                            <input

                                value={form.nombre}

                                onChange={(e)=>

                                    setForm({

                                        ...form,

                                        nombre:soloLetras(limpiarTexto( e.target.value ) )

                                    })

                                }

                                placeholder="Nombre"

                                className="w-full rounded-xl bg-zinc-950 p-3 outline-none"

                            />

                            <input

                                value={form.apellido}

                                onChange={(e)=>

                                    setForm({

                                        ...form,

                                        apellido:soloLetras ( limpiarTexto (e.target.value ))

                                    })

                                }

                                placeholder="Apellido"

                                className="w-full rounded-xl bg-zinc-950 p-3 outline-none"

                            />

                            <input

                                value={form.cedula}

                                onChange={(e)=>

                                    setForm({

                                        ...form,

                                        cedula: soloNumeros( e.target.value)

                                    })

                                }

                                placeholder="Cédula"

                                className="w-full rounded-xl bg-zinc-950 p-3 outline-none"

                            />

                            <input

                                value={form.telefono}

                                onChange={(e)=>

                                    setForm({

                                        ...form,

                                        telefono: soloNumeros (e.target.value)

                                    })

                                }

                                placeholder="Teléfono"

                                className="w-full rounded-xl bg-zinc-950 p-3 outline-none"

                            />

                            <input

                                value={form.correo}

                                onChange={(e)=>

                                    setForm({

                                        ...form,

                                        correo: limpiarTexto(e.target.value)

                                    })

                                }

                                placeholder="Correo"

                                className="w-full rounded-xl bg-zinc-950 p-3 outline-none"

                            />

                        </div>

                        <div className="mt-8 flex justify-end gap-3">

                            <button

                                onClick={()=>

                                    setModalEditar(null)

                                }

                            >

                                Cancelar

                            </button>

                            <button

                                onClick={guardarEdicion}

                                className="rounded-xl bg-blue-600 px-6 py-2 hover:bg-blue-700"

                            >

                                Guardar

                            </button>

                        </div>

                    </div>

                </div>
            }

        </div>

    );

}

export default Usuarios;