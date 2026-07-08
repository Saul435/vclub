import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function Empleados() {

  const [empleados, setEmpleados] = useState([]);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    tanda_labor: "Matutina",
    porciento_comision: "",
    fecha_ingreso: ""
  });

  const [busqueda, setBusqueda] = useState({

    nombre: "",

    cedula: "",

    tanda_labor: "",

    estado: ""

  });

  const cargarDatos = async () => {

    const response =
      await api.get("/empleados");

    setEmpleados(response.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const buscar = async () => {

    try {

      const response = await api.get(

        "/empleados/buscar",

        {

          params: busqueda

        }

      );

      setEmpleados(response.data);

    }

    catch (error) {

      toast.error("Error realizando búsqueda");

    }

  };

  const limpiarBusqueda = () => {

    setBusqueda({

      nombre: "",

      cedula: "",

      tanda_labor: "",

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
      !form.tanda_labor ||
      !form.porciento_comision ||
      !form.fecha_ingreso
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {

      if (editando) {

        await api.put(
          `/empleados/${editando.id}`,
          form
        );

        toast.success(
          "Empleado actualizado"
        );

      } else {

        await api.post(
          "/empleados",
          form
        );

        toast.success(
          "Empleado guardado"
        );

      }

      setForm({
        nombre: "",
        cedula: "",
        tanda_labor: "Matutina",
        porciento_comision: "",
        fecha_ingreso: ""
      });

      setEditando(null);

      cargarDatos();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Error al guardar empleado"
      );

    }

  };

  const editar = (empleado) => {

    setEditando(empleado);

    setForm({
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      tanda_labor:
        empleado.tanda_labor,
      porciento_comision:
        empleado.porciento_comision,
      fecha_ingreso:
        empleado.fecha_ingreso
    });
  };

  const cambiarEstado = async (id) => {

    await api.put(
      `/empleados/${id}/estado`
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
        `/empleados/${id}`
      );

      toast.success(
        "Empleado eliminado"
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
          Gestión de Empleados
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Empleados
        </p>

      </div>

      <div className="netflix-card mb-6">

        <h2 className="text-2xl font-bold mb-5">

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

            name="tanda_labor"

            value={busqueda.tanda_labor}

            onChange={handleBusqueda}

          >

            <option value="">

              Todas las tandas

            </option>

            <option value="Matutina">

              Matutina

            </option>

            <option value="Vespertina">

              Vespertina

            </option>

            <option value="Nocturna">

              Nocturna

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

        <select
          name="tanda_labor"
          value={form.tanda_labor}
          onChange={handleChange}
          className="netflix-input"
        >
          <option>
            Matutina
          </option>

          <option>
            Vespertina
          </option>

          <option>
            Nocturna
          </option>
        </select>

        <input
          type="number"
          name="porciento_comision"
          placeholder="% Comisión"
          value={form.porciento_comision}
          onChange={handleChange}
          className="netflix-input"
        />

        <input
          type="date"
          name="fecha_ingreso"
          value={form.fecha_ingreso}
          onChange={handleChange}
          className="netflix-input"
        />

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
              <th>Tanda</th>
              <th>Comisión</th>
              <th>Ingreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>

          </thead>

          <tbody>

            {
              empleados.map(
                empleado => (

                  <tr key={empleado.id}>

                    <td>{empleado.id}</td>

                    <td>{empleado.nombre}</td>

                    <td>{empleado.cedula}</td>

                    <td>
                      {empleado.tanda_labor}
                    </td>

                    <td>
                      {empleado.porciento_comision}%
                    </td>

                    <td>
                      {empleado.fecha_ingreso}
                    </td>

                    <td>
                      {
                        empleado.estado ? (
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
                          editar(empleado)
                        }
                        className="mr-2"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          cambiarEstado(
                            empleado.id
                          )
                        }
                      >
                        {
                          empleado.estado
                            ? "Desactivar"
                            : "Activar"
                        }
                      </button>

                      <button
                        onClick={() => eliminar(empleado.id)}
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

export default Empleados;