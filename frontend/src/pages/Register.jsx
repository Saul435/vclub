import { useState } from "react";

import {

User,
Mail,
Lock,
Phone,
CreditCard

} from "lucide-react";

import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "@/services/api";

import AuthLayout from "@/components/auth/AuthLayout";

function Register(){

const navigate = useNavigate();

const [loading,setLoading]=useState(false);

const [form,setForm]=useState({

nombre:"",
apellido:"",
cedula:"",
telefono:"",
correo:"",
password:"",
confirmar_password:""

});

const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};

const handleSubmit=async(e)=>{

e.preventDefault();

if(form.password!==form.confirmar_password){

toast.error("Las contraseñas no coinciden.");

return;

}

try{

setLoading(true);

await api.post(

"/registro/solicitar",

form

);

toast.success(

"Revisa tu correo para verificar tu cuenta."

);

navigate(

"/verificar-correo",

{

state:{

correo:form.correo

}

}

);

}

catch(error){

toast.error(

error.response?.data?.error ||

"Error al registrar."

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

`;

return(

<AuthLayout>

<form

onSubmit={handleSubmit}

className="space-y-5"

>

<div className="grid grid-cols-2 gap-4">

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

name="nombre"

value={form.nombre}

onChange={handleChange}

placeholder="Nombre"

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

name="apellido"

value={form.apellido}

onChange={handleChange}

placeholder="Apellido"

className={inputStyle}

/>

</div>

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

className={inputStyle}

/>

</div>

</div>

<div>

<label className="text-sm text-zinc-400">

Correo electrónico

</label>

<div className="relative mt-2">

<Mail

size={18}

className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

/>

<input

type="email"

name="correo"

value={form.correo}

onChange={handleChange}

placeholder="correo@email.com"

className={inputStyle}

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

className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

/>

<input

type="password"

name="password"

value={form.password}

onChange={handleChange}

placeholder="********"

className={inputStyle}

/>

</div>

</div>

<div>

<label className="text-sm text-zinc-400">

Confirmar contraseña

</label>

<div className="relative mt-2">

<Lock

size={18}

className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"

/>

<input

type="password"

name="confirmar_password"

value={form.confirmar_password}

onChange={handleChange}

placeholder="********"

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

transition

hover:bg-red-700

disabled:opacity-60

"

>

{

loading

?

"Enviando solicitud..."

:

"Enviar solicitud"

}

</motion.button>

<p className="text-center text-sm text-zinc-400">

¿Ya tienes una cuenta?{" "}

<Link

to="/login"

className="text-red-500 hover:underline"

>

Inicia sesión

</Link>

</p>

</form>

</AuthLayout>

);

}

export default Register;