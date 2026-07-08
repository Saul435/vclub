import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function Login({ setUsuario }) {

    const [correo, setCorreo] = useState("");

    const [password, setPassword] = useState("");

    const iniciarSesion = async () => {

        if (!correo || !password) {

            toast.error(
                "Complete todos los campos"
            );

            return;
        }

        try {

            const response = await api.post("/login", {

                correo,
                password

            });

            localStorage.setItem(
                "usuario",
                JSON.stringify(response.data)
            );

            setUsuario(response.data);

            toast.success(
                "Bienvenido " +
                response.data.correo
            );

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "No se pudo iniciar sesión"

            );

        }

    };
    
    

    return (

        <div className="min-h-screen flex justify-center items-center bg-zinc-950">

            <div className="bg-zinc-900 p-8 rounded-xl w-96">

                <h1 className="text-3xl text-red-600 text-center mb-6">

                    VIDEO CLUB

                </h1>

                <input

                    className="w-full p-2 mb-4 rounded bg-zinc-800"

                    placeholder="Correo electrónico"

                    value={correo}

                    onChange={(e) => setCorreo(e.target.value)}

                />

                <input

                    type="password"

                    className="w-full p-2 mb-6 rounded bg-zinc-800"

                    placeholder="Contraseña"

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                />

                <button

                    onClick={iniciarSesion}

                    className="w-full bg-red-600 p-2 rounded"

                >

                    Iniciar Sesión

                </button>

            </div>

        </div>

    );

}

export default Login;