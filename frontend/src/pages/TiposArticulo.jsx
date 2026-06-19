import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function TiposArticulo() {

  const [tipos, setTipos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);

  const cargarDatos = async () => {

    const response = await api.get(
      "/tipos-articulo"
    );

    setTipos(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);


  const editar = (tipo) => {

  setEditando(tipo);

  setDescripcion(
    tipo.descripcion
  );

};


const cambiarEstado = async (id) => {

  await api.put(
    `/tipos-articulo/${id}/estado`
  );

  cargarDatos();
};



  const guardar = async () => {

  if (editando) {

    await api.put(
      `/tipos-articulo/${editando.id}`,
      {
        descripcion,
        estado: editando.estado
      }
    );

  } else {

    await api.post(
      "/tipos-articulo",
      {
        descripcion,
        estado: true
      }
    );

  }

  setDescripcion("");
  setEditando(null);

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
        `/tipos-articulo/${id}`
      );

      toast.success(
        "Tipo eliminado"
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
        Tipos de Artículos
      </h1>

      <p className="text-zinc-400 mt-2">
        Administración de Artículos
      </p>

    </div>


      <div className="netflix-card mb-5">

        {
            editando && (
                <p>
                Editando:
                {editando.descripcion}
                </p>
            )
        }

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) =>
            setDescripcion(e.target.value)
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
            tipos.map(tipo => (

              <tr key={tipo.id}>
                <td>{tipo.id}</td>

                <td>{tipo.descripcion}</td>

                <td>

                {
                    tipo.estado ? (
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
                    onClick={() => editar(tipo)}
                    >
                    Editar
                    </button>

                    <button
                    onClick={() =>
                        cambiarEstado(tipo.id)
                    }
                    >
                    {tipo.estado ? "Desactivar" : "Activar"}
                    </button>

                    <button
                    onClick={() => eliminar(tipo.id) } 
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

export default TiposArticulo;