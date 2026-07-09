import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

import { MailCheck } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "@/services/api";

import AuthLayout from "@/components/auth/AuthLayout";

function VerifyEmail(){

const navigate=useNavigate();

const location=useLocation();

const correo=location.state?.correo || "";

useEffect(() => {
    if (!correo) {
        navigate("/register", { replace: true });
    }
}, [correo, navigate]);


const [codigo,setCodigo]=useState(

["","","","","",""]

);

const [loading,setLoading]=useState(false);

const [segundos,setSegundos]=useState(60);

const inputs=useRef([]);

useEffect(()=>{

if(segundos<=0) return;

const timer=setTimeout(()=>{

setSegundos(

segundos-1

);

},1000);

return()=>clearTimeout(timer);

},[segundos]);

const handleChange=(value,index)=>{

if(!/^[0-9]?$/.test(value)) return;

const nuevo=[...codigo];

nuevo[index]=value;

setCodigo(nuevo);

if(value && index<5){

inputs.current[index+1].focus();

}

};

const handleKey=(e,index)=>{

if(

e.key==="Backspace"

&&

!codigo[index]

&&

index>0

){

inputs.current[index-1].focus();

}

};

const handlePaste=(e)=>{

const texto=e.clipboardData

.getData("text")

.replace(/\D/g,"")

.slice(0,6);

if(texto.length===6){

setCodigo(

texto.split("")

);

setCodigo(texto.split(""));
inputs.current[5]?.focus();

inputs.current[5].focus();

}

};

const verificar=async()=>{

const code=codigo.join("");

if(code.length!==6){

toast.error(

"Ingresa el código completo."

);

return;

}

try{

setLoading(true);

await api.post(

"/registro/verificar",

{

correo,

codigo:code

}

);

toast.success(

"Correo verificado correctamente."

);

navigate("/login");

}

catch(error){

toast.error(

error.response?.data?.error ||

"Error al verificar."

);

}

finally{

setLoading(false);

}

};

const reenviar=async()=>{

try{

await api.post(

"/registro/reenviar",

{

correo

}

);

toast.success(

"Nuevo código enviado."

);

setSegundos(60);

}

catch(error){

toast.error(

error.response?.data?.error ||

"Error."

);

}

};




return(

<AuthLayout>

<div className="space-y-7">

<div className="text-center">

<div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-600">

<MailCheck

size={40}

/>

</div>

<h2 className="text-2xl font-bold">

Verifica tu correo

</h2>

<p className="mt-2 text-sm text-zinc-400">

Enviamos un código de 6 dígitos a

</p>

<p className="mt-1 font-semibold text-red-500">

{correo}

</p>

</div>

<div

onPaste={handlePaste}

className="flex justify-center gap-3"

>

{

codigo.map((_,index)=>(

<input

key={index}

ref={(el)=>

inputs.current[index]=el

}

maxLength={1}

onChange={(e)=>

handleChange(

e.target.value,

index

)

}

onKeyDown={(e)=>

handleKey(

e,

index

)

}

className="

h-16

w-14

rounded-xl

border

border-zinc-700

bg-zinc-950

text-center

text-2xl

font-bold

outline-none

transition

focus:border-red-500

"

/>

))

}

</div>

<motion.button

whileHover={{

scale:1.02

}}

whileTap={{

scale:.96

}}

disabled={loading}

onClick={verificar}

className="

w-full

rounded-xl

bg-red-600

py-3

font-semibold

hover:bg-red-700

disabled:opacity-60

"

>

{

loading

?

"Verificando..."

:

"Verificar correo"

}

</motion.button>

<div className="text-center">

{

segundos>0

?

<p className="text-zinc-500">

Reenviar código en {segundos}s

</p>

:

<button
type="button"

onClick={reenviar}

className="text-red-500 hover:underline"

>

Reenviar código

</button>

}

</div>

</div>

</AuthLayout>

);

}

export default VerifyEmail;