import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Elencos() {

  const [elencos, setElencos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);
  
  const cargarDatos = async() => {

    const response = await api.get("/elencos");

    setElencos(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardar = async () => {

    if (editando) {

      await api.put(`/elencos/${editando.id}`,
        {nombre}
      );


    }
    else {
      await api.post("/elencos", {nombre});
    }

    setNombre("");
    setEditando(null);

    cargarDatos ();
  };

  const editar = (elenco) => {

    setEditando(elenco);

    setNombre(
      elenco.nombre
    );
  };

  const cambiarEstado = async (id) => {

    await api.put(
      `/elencos/${id}/estado`
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
        `/elencos/${id}`
      );

      toast.success(
        "Elenco eliminado"
      );

      cargarDatos();

    }
    catch(error){

      toast.error(
        "Error eliminando registro"
      );

    }

  };

  return(
    <motion.div initial={{ opacity: 0, y: 20}}
    animate={{  opacity: 1,  y: 0}}
    transition={{  duration: .4}}>

      <div className="netflix-card mb-6">

        <h1 className="text-3xl font-bold">
          Gestión de Elencos
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Elencos
        </p>

      </div>

      <div className="netflix-card mb-5">
      <input type="text"
      placeholder="Nombre"
      value={nombre}
      onChange={(e) =>
        setNombre(e.target.value)
      } 
      className="netflix-input"
      />

      <button onClick={guardar} 
      className="netflix-button mt-4">
        Guardar
      </button>

      </div>

      <div className="netflix-card">
      <table className="netflix-table">
      
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {
          elencos.map(e => (

              <tr key={e.id}>

                <td>{e.id}</td>

                <td>{e.nombre}</td>

                <td>
                  {
                    e.estado ? (
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
                    onClick={() => editar(e)}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(e.id)
                    }
                  >
                    {
                      e.estado
                        ? "Desactivar"
                        : "Activar"
                    }
                  </button>

                  <button
                    onClick={() => eliminar(e.id) } 
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

export default Elencos;