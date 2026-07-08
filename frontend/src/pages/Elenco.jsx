import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Elencos() {

  const [elencos, setElencos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(null);

  const [busqueda, setBusqueda] = useState({

    descripcion: "",

    estado: ""

  });

  const cargarDatos = async () => {

    const response = await api.get("/elencos");

    setElencos(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const buscar = async () => {

    try {

      const response = await api.get(

        "/elencos/buscar",

        {

          params: busqueda

        }

      );

      setElencos(response.data);

    }

    catch (error) {

      toast.error("Error realizando búsqueda");

    }

  };

  const limpiarBusqueda = () => {

    setBusqueda({

      descripcion: "",

      estado: ""

    });

    cargarDatos();

  };

  const handleBusqueda = (e) => {

    setBusqueda({

      ...busqueda,

      [e.target.name]: e.target.value

    });

  };

  const guardar = async () => {

    if (!nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (editando) {

      await api.put(
        `/elencos/${editando.id}`,
        { nombre }
      );

    } else {

      await api.post(
        "/elencos",
        { nombre }
      );

    }

    setNombre("");
    setEditando(null);

    cargarDatos();
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

    if (!confirmar) return;

    try {

      await api.delete(
        `/elencos/${id}`
      );

      toast.success(
        "Elenco eliminado"
      );

      cargarDatos();

    }
    catch (error) {

      toast.error(
        "Error eliminando registro"
      );

    }

  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }}>

      <div className="netflix-card mb-6">

        <h1 className="text-3xl font-bold">
          Gestión de Elencos
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Elencos
        </p>

      </div>

      <div className="netflix-card mb-6">

        <h2 className="text-2xl font-bold mb-5">

          Buscador

        </h2>

        <input

          className="netflix-input"

          placeholder="Descripción"

          name="descripcion"

          value={busqueda.descripcion}

          onChange={handleBusqueda}

        />

        <select

          className="netflix-input mt-4"

          name="estado"

          value={busqueda.estado}

          onChange={handleBusqueda}

        >

          <option value="">

            Todos

          </option>

          <option value="true">

            Activos

          </option>

          <option value="false">

            Inactivos

          </option>

        </select>

        <div className="flex gap-3 mt-5">

          <button

            className="netflix-button"

            onClick={buscar}

          >

            Buscar

          </button>

          <button

            className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded"

            onClick={limpiarBusqueda}

          >

            Limpiar

          </button>

        </div>

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
                      onClick={() => eliminar(e.id)}
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