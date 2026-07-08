import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Clientes() {

  const [clientes, setClientes] = useState([]);

  const [editando, setEditando] =
    useState(null);

  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    tarjeta_credito: "",
    limite_credito: "",
    tipo_persona: "Fisica"
  });

  const [busqueda, setBusqueda] = useState({
    nombre: "",
    cedula: "",
    tipo_persona: "",
    estado: ""
  });


  const cargarDatos = async () => {

    const response =
      await api.get("/clientes");

    setClientes(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const buscar = async () => {
    try {
      const response = await api.get(
        "/clientes/buscar",
        {
          params: busqueda
        }
      );
      setClientes(response.data);
    }
    catch (error) {
      toast.error("Error realizando la búsqueda");
    }

  };

  const limpiarBusqueda = () => {

    setBusqueda({

      nombre: "",

      cedula: "",

      tipo_persona: "",

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

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };

  const guardar = async () => {

    if (
      !form.nombre.trim() ||
      !form.cedula.trim() ||
      !form.tarjeta_credito.trim() ||
      !form.limite_credito ||
      !form.tipo_persona
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {

      if (editando) {

        await api.put(
          `/clientes/${editando.id}`,
          form
        );

        toast.success(
          "Cliente actualizado"
        );

      } else {

        await api.post(
          "/clientes",
          form
        );

        toast.success(
          "Cliente guardado"
        );

      }

      setForm({
        nombre: "",
        cedula: "",
        tarjeta_credito: "",
        limite_credito: "",
        tipo_persona: "Fisica"
      });

      setEditando(null);

      cargarDatos();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Error al guardar"
      );

    }

  };

  const editar = (cliente) => {

    setEditando(cliente);

    setForm({
      nombre: cliente.nombre,
      cedula: cliente.cedula,
      tarjeta_credito:
        cliente.tarjeta_credito,
      limite_credito:
        cliente.limite_credito,
      tipo_persona:
        cliente.tipo_persona
    });
  };

  const cambiarEstado = async (id) => {

    await api.put(
      `/clientes/${id}/estado`
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
        `/clientes/${id}`
      );

      toast.success(
        "Cliente eliminado"
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
          Gestión de Clientes
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Clientes
        </p>

      </div>

      <div className="netflix-card mb-6">

        <h2 className="text-2xl font-bold mb-4">

          Buscador

        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input

            className="netflix-input"

            placeholder="Nombre"

            name="nombre"

            value={busqueda.nombre}

            onChange={handleBusqueda}

          />

          <input

            className="netflix-input"

            placeholder="Cédula"

            name="cedula"

            value={busqueda.cedula}

            onChange={handleBusqueda}

          />

          <select

            className="netflix-input"

            name="tipo_persona"

            value={busqueda.tipo_persona}

            onChange={handleBusqueda}

          >

            <option value="">

              Todos los tipos

            </option>

            <option value="Fisica">

              Física

            </option>

            <option value="Juridica">

              Jurídica

            </option>

          </select>

          <select

            className="netflix-input"

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

        </div>

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

        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="netflix-input"
        />

        <input
          name="cedula"
          placeholder="Cédula"
          value={form.cedula}
          onChange={handleChange}
          className="netflix-input"
        />

        <input
          name="tarjeta_credito"
          placeholder="Tarjeta"
          value={form.tarjeta_credito}
          onChange={handleChange}
          className="netflix-input"
        />

        <input
          type="number"
          name="limite_credito"
          placeholder="Límite"
          value={form.limite_credito}
          onChange={handleChange}
          className="netflix-input"
        />

        <select
          name="tipo_persona"
          value={form.tipo_persona}
          onChange={handleChange}
          className="netflix-input"
        >
          <option value="Fisica">
            Física
          </option>

          <option value="Juridica">
            Jurídica
          </option>
        </select>



        <button
          onClick={guardar}
          className="netflix-button mt-4"
        >
          {
            editando
              ? "Actualizar"
              : "Guardar"
          }
        </button>
      </div>



      <div className="netflix-card">
        <table className="netflix-table">

          <thead>

            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cédula</th>
              <th>Límite</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {
              clientes.map(cliente => (

                <tr key={cliente.id}>

                  <td>{cliente.id}</td>

                  <td>{cliente.nombre}</td>

                  <td>{cliente.cedula}</td>

                  <td>
                    {cliente.limite_credito}
                  </td>

                  <td>
                    {cliente.tipo_persona}
                  </td>

                  <td>
                    {
                      cliente.estado ? (
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
                      onClick={() =>
                        editar(cliente)
                      }
                      className="mr-2"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        cambiarEstado(
                          cliente.id
                        )
                      }
                    >
                      {
                        cliente.estado
                          ? "Desactivar"
                          : "Activar"
                      }
                    </button>

                    <button
                      onClick={() => eliminar(cliente.id)}
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

export default Clientes;