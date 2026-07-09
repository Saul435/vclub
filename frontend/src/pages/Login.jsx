import { useState } from "react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff
} from "lucide-react";

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/services/api";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

function Login(){

    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading,setLoading] = useState(false);

    const [mostrarPassword,setMostrarPassword] = useState(false);

    const [recordarme,setRecordarme] = useState(true);

    const [form,setForm]=useState({
        correo:"",
        password:""
    });

    const handleChange=(e)=>{

        setForm({
            ...form,
            [e.target.name]:e.target.value
        });

    };

    const handleSubmit=async(e)=>{

        e.preventDefault();

        try{

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                form
            );

            login(
                response.data,
                recordarme
            );

            toast.success(
                `Bienvenido ${response.data.usuario.nombre}`
            );

            navigate("/dashboard");

        }

        catch(error){

            const mensaje =
                error.response?.data?.error ||
                "No fue posible iniciar sesión.";

            toast.error(mensaje);

        }

        finally{

            setLoading(false);

        }

    };


    const handleGoogleSuccess = async (credentialResponse) => {

        try {

            const response = await api.post(
                "/google/login",
                {
                    credential: credentialResponse.credential
                }
            );

            const data = response.data;

            if(data.access_token){

                login(
                    data,
                    true
                );


                toast.success(
                    `Bienvenido ${data.usuario.nombre}`
                );


                navigate("/dashboard");

                return;

            }



            if(data.solicitud){

                toast(
                    "Tu solicitud todavía está pendiente."
                );

                return;

            }



            navigate(
                "/register-google",
                {
                    state:data
                }
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.error ||
                "Error con Google."
            );

        }

    };

    const handleGoogleError = () => {

        toast.error("No fue posible iniciar sesión con Google.");

    };

    return(

<AuthLayout>

<form
onSubmit={handleSubmit}
className="space-y-6"
>

<div>

<label className="text-sm text-zinc-400">

Correo electrónico

</label>

<div className="relative mt-2">

<Mail
size={18}
className="
absolute
left-4
top-1/2
-translate-y-1/2
text-zinc-500
"
/>

<input

type="email"

name="correo"

value={form.correo}

onChange={handleChange}

placeholder="correo@empresa.com"

required

className="
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
"

/>

</div>

</div>

<div>

<label className="text-sm text-zinc-400">

Contraseña

</label>

<div className="relative mt-2">

<Lock
size={18}
className="
absolute
left-4
top-1/2
-translate-y-1/2
text-zinc-500
"
/>

<input

type={
mostrarPassword
?
"text"
:
"password"
}

name="password"

value={form.password}

onChange={handleChange}

placeholder="********"

required

className="
w-full
rounded-xl
border
border-zinc-700
bg-zinc-950
py-3
pl-11
pr-12
outline-none
transition
focus:border-red-500
"

/>

<button

type="button"

onClick={()=>

setMostrarPassword(

!mostrarPassword

)

}

className="
absolute
right-4
top-1/2
-translate-y-1/2
text-zinc-500
"

>

{

mostrarPassword

?

<EyeOff size={18}/>

:

<Eye size={18}/>

}

</button>

</div>

</div>
{/*
<div
className="
flex
items-center
justify-between
text-sm
"
>

<label
className="
flex
items-center
gap-2
cursor-pointer
"
>

<input

type="checkbox"

checked={recordarme}

onChange={()=>

setRecordarme(

!recordarme

)

}

/>

Recordarme

</label>

<Link

to="/recuperar"

className="
text-red-500
hover:underline
"

>

¿Olvidaste tu contraseña?

</Link>

</div>
*/}
<motion.button

whileHover={{
scale:1.02
}}

whileTap={{
scale:.97
}}

disabled={loading}

className="
w-full
rounded-xl
bg-red-600
py-3
font-semibold
transition
hover:bg-red-700
disabled:opacity-60
"

>

{

loading

?

"Iniciando sesión..."

:

"Iniciar sesión"

}

</motion.button>

<div
className="
flex
items-center
gap-4
"
>

<div className="h-px flex-1 bg-zinc-700"/>

<span className="text-zinc-500 text-sm">

o

</span>

<div className="h-px flex-1 bg-zinc-700"/>

</div>

<div className="flex justify-center">

    <GoogleLogin

        onSuccess={handleGoogleSuccess}

        onError={handleGoogleError}

        theme="filled_black"

        shape="pill"

        size="large"

        text="continue_with"

    />

</div>

<p
className="
text-center
text-sm
text-zinc-400
"
>

¿No tienes cuenta?

{" "}

<Link

to="/register"

className="
text-red-500
hover:underline
"

>

Solicitar acceso

</Link>

</p>

</form>

</AuthLayout>

);

}

export default Login;