import { useState } from "react";

import {
    User,
    Mail,
    Phone,
    CreditCard
} from "lucide-react";

import { motion } from "framer-motion";

import { Link, useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "@/services/api";

import AuthLayout from "@/components/auth/AuthLayout";

import { soloNumeros } from "@/services/validacion";


function RegisterGoogle(){

    const navigate = useNavigate();

    const { state } = useLocation();

    const [loading,setLoading] = useState(false);


    const [form,setForm] = useState({

        nombre: state?.nombre || "",

        apellido: state?.apellido || "",

        correo: state?.correo || "",

        google_id: state?.google_id || "",

        cedula:"",

        telefono:""

    });



    const handleChange=(e)=>{

        let valor = e.target.value;


        if(e.target.name === "cedula"){

            valor = soloNumeros(valor);

        }


        if(e.target.name === "telefono"){

            valor = soloNumeros(valor);

        }


        setForm({

            ...form,

            [e.target.name]: valor

        });

    };



    const handleSubmit=async(e)=>{

        e.preventDefault();


        try{

            setLoading(true);


            await api.post(

                "/google/register",

                form

            );


            toast.success(
                "Solicitud enviada correctamente."
            );


            navigate("/login");


        }

        catch(error){

            toast.error(

                error.response?.data?.error ||

                "Error al registrar con Google."

            );

        }

        finally{

            setLoading(false);

        }

    };



    const inputStyle=`

    w-full

    rounded-xl

    border

    border-zinc-700

    bg-zinc-950

    py-3

    pl-11

    pr-4

    outline-none

    transition

    focus:border-red-500

    disabled:opacity-60

    `;



    return(

    <AuthLayout>


    <form

    onSubmit={handleSubmit}

    className="space-y-5"

    >



    <h1 className="text-2xl font-bold text-center">

        Completar registro con Google

    </h1>



    <div>


    <label className="text-sm text-zinc-400">

    Nombre

    </label>


    <div className="relative mt-2">


    <User

    size={18}

    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

    />


    <input

    value={form.nombre}

    disabled

    className={inputStyle}

    />


    </div>

    </div>




    <div>


    <label className="text-sm text-zinc-400">

    Apellido

    </label>


    <div className="relative mt-2">


    <User

    size={18}

    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

    />


    <input

    value={form.apellido}

    disabled

    className={inputStyle}

    />


    </div>

    </div>





    <div>


    <label className="text-sm text-zinc-400">

    Correo

    </label>


    <div className="relative mt-2">


    <Mail

    size={18}

    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

    />


    <input

    value={form.correo}

    disabled

    className={inputStyle}

    />


    </div>

    </div>





    <div>


    <label className="text-sm text-zinc-400">

    Cédula

    </label>


    <div className="relative mt-2">


    <CreditCard

    size={18}

    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

    />


    <input

    name="cedula"

    value={form.cedula}

    onChange={handleChange}

    placeholder="00112345678"

    required

    className={inputStyle}

    />


    </div>

    </div>





    <div>


    <label className="text-sm text-zinc-400">

    Teléfono

    </label>


    <div className="relative mt-2">


    <Phone

    size={18}

    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

    />


    <input

    name="telefono"

    value={form.telefono}

    onChange={handleChange}

    placeholder="8090000000"

    required

    className={inputStyle}

    />


    </div>

    </div>





    <motion.button

    type="submit"

    disabled={loading}


    whileHover={{
        scale:1.02
    }}


    whileTap={{
        scale:.97
    }}


    className="

    w-full

    rounded-xl

    bg-red-600

    py-3

    font-semibold

    hover:bg-red-700

    "

    >


    {

    loading

    ?

    "Enviando..."

    :

    "Enviar solicitud"

    }


    </motion.button>



    <p className="text-center text-sm text-zinc-400">

    ¿Ya tienes cuenta?


    {" "}


    <Link

    to="/login"

    className="text-red-500 hover:underline"

    >

    Iniciar sesión

    </Link>


    </p>



    </form>


    </AuthLayout>

    );

}


export default RegisterGoogle;