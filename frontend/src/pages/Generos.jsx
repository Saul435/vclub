import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import useHighlight from "@/services/useHighlight";
import { soloLetras } from "@/services/validacion";

function Generos() {

  const [generos, setGeneros] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const highlightId = useHighlight();

  const cargarDatos = async () => {

    const response = await api.get("/generos");

    setGeneros(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardar = async () => {

    if (!descripcion.trim()) {

        toast.error(
            "La descripción es obligatoria"
        );

        return;
    }


    try {

        if(editando){

            await api.put(
                `/generos/${editando.id}`,
                {
                    descripcion
                }
            );

            toast.success(
                "Género actualizado"
            );

        }
        else{

            await api.post(
                "/generos",
                {
                    descripcion
                }
            );

            toast.success(
                "Género creado"
            );

        }


        setDescripcion("");

        setEditando(null);

        cargarDatos();


    } catch(error){

        toast.error(

            error.response?.data?.error ||

            "Error guardando género."

        );

    }

};

  const editar = (genero) => {

    setEditando(genero);

    setDescripcion(
      genero.descripcion
    );
  };

  const cambiarEstado = async (id) => {

    await api.put(
      `/generos/${id}/estado`
    );

    cargarDatos();
  };

  const eliminar = async (id) => {

    const confirmar =
      window.confirm(
        "¿Desea eliminar este registro?"
      );

    if(!confirmar) return;

    try {

      await api.delete(
        `/generos/${id}`
      );

      toast.success(
        "Generos eliminado"
      );

      cargarDatos();

    }
    catch(error){

      toast.error(
        "Error eliminando registro"
      );

    }

  };

  return (
    <motion.div initial={{ opacity: 0, y: 20}}
    animate={{  opacity: 1,  y: 0}}
    transition={{  duration: .4}}>

      <div className="netflix-card mb-6">

        <h1 className="text-3xl font-bold">
          Gestión de Generos
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Generos
        </p>

      </div>

      <div className="netflix-card mb-5">
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) =>
            setDescripcion(
                soloLetras(e.target.value)
            )
        }
        className="netflix-input"
      />

      <button
        onClick={guardar}
        className="netflix-button mt-4"
      >
        Guardar
      </button>

      </div>

      <div className="netflix-card">
      <table className="netflix-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {
            generos.map(g => (

              <tr

            key={g.id}

            className={

                g.id === highlightId

                    ? `
                        bg-yellow-400/20
                        ring-2
                        ring-yellow-400
                        transition-all
                        duration-500
                      `

                    : ""

            }

        >


                <td>{g.id}</td>

                <td>{g.descripcion}</td>

                <td>
                  {
                    g.estado ? (
                    <span className="text-green-600">
                        Activo
                    </span>
                    ) : (
                    <span className="text-red-600">
                        Inactivo
                    </span>
                    )
                }
                </td>

                <td>

                  <button
                    onClick={() => editar(g)}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(g.id)
                    }
                  >
                    {
                      g.estado
                        ? "Desactivar"
                        : "Activar"
                    }
                  </button>

                  <button
                    onClick={() => eliminar(g.id) } 
                    className=" bg-red-600 text-white px-2 py-1 rounded ml-2"
                  >
                    Eliminar
                  </button>

                </td>

              </tr>

            ))
          }

        </tbody>

      </table>

      </div>

    </motion.div>
  );
}

export default Generos;