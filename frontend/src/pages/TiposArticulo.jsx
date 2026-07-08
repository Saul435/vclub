import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function TiposArticulo() {

  const [tipos, setTipos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);

  const [busqueda, setBusqueda] = useState({

    descripcion: "",

    estado: ""

  });

  const cargarDatos = async () => {

    const response = await api.get(
      "/tipos-articulo"
    );

    setTipos(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const buscar = async () => {

    try {

      const response = await api.get(

        "/tipos-articulo/buscar",

        {

          params: busqueda

        }

      );

      setTipos(response.data);

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

    if (!descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }

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

    if (!confirmar) return;

    try {

      await api.delete(
        `/tipos-articulo/${id}`
      );

      toast.success(
        "Tipo eliminado"
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
          Tipos de Artículos
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Artículos
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
                      onClick={() => eliminar(tipo.id)}
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