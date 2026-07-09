import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { buscar } from "@/services/busquedaService";

function Topbar() {

    const navigate = useNavigate();

    const [texto, setTexto] = useState("");
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (texto.trim().length < 2) {

            setResultados([]);

            return;

        }

        const timer = setTimeout(async () => {

            try {

                setLoading(true);

                const data = await buscar(texto);

                setResultados(data);

            }

            catch {

                setResultados([]);

            }

            finally {

                setLoading(false);

            }

        }, 300);

        return () => clearTimeout(timer);

    }, [texto]);



    function seleccionarResultado(resultado) {

        navigate(resultado.ruta, {

            state: {

                highlightId: resultado.id

            }

        });

        setTexto("");

        setResultados([]);

    }



    return (

        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">

            <div className="flex h-20 items-center justify-between px-8">

                <div>

                    <h1 className="text-2xl font-bold text-white">

                        Dashboard

                    </h1>

                </div>

                <div className="flex items-center gap-4">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                        />

                        <input

                            value={texto}

                            onChange={(e) => setTexto(e.target.value)}

                            placeholder="Buscar usuarios, clientes, artículos..."

                            className="
                                w-80
                                rounded-xl
                                border
                                border-zinc-700
                                bg-zinc-900
                                py-3
                                pl-11
                                pr-4
                                text-sm
                                outline-none
                                transition-all
                                focus:border-red-500
                            "

                        />

                        {

                            texto.trim().length >= 2 && (

                                <div

                                    className="
                                        absolute
                                        left-0
                                        top-14
                                        w-full
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-zinc-800
                                        bg-zinc-900
                                        shadow-2xl
                                        z-50
                                    "

                                >

                                    {

                                        loading &&

                                        <div className="p-4 text-zinc-500">

                                            Buscando...

                                        </div>

                                    }

                                    {

                                        !loading && resultados.length === 0 &&

                                        <div className="p-4 text-zinc-500">

                                            Sin resultados

                                        </div>

                                    }

                                    {

                                        resultados.map((resultado) => (

                                            <button

                                                key={`${resultado.tipo}-${resultado.id}`}

                                                onClick={() => seleccionarResultado(resultado)}

                                                className="
                                                    flex
                                                    w-full
                                                    flex-col
                                                    items-start
                                                    border-b
                                                    border-zinc-800
                                                    p-4
                                                    text-left
                                                    transition
                                                    hover:bg-zinc-800
                                                "

                                            >

                                                <span className="font-medium text-white">

                                                    {resultado.titulo}

                                                </span>

                                                <span className="text-xs text-red-400">

                                                    {resultado.tipo}

                                                </span>

                                            </button>

                                        ))

                                    }

                                </div>

                            )

                        }

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Topbar;