import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import toast from "react-hot-toast";

import useHighlight from "@/services/useHighlight";


function DescripcionArticulos() {

  const highlightId = useHighlight();

  const [registros,
    setRegistros] = useState([]);

  const [tipos,
    setTipos] = useState([]);

  const [idiomas,
    setIdiomas] = useState([]);

  const [editando,
    setEditando] = useState(null);

  const [form, setForm] =
    useState({

      titulo: "",

      tipo_articulo_id: "",

      idioma_id: "",

      renta_dia: "",

      dias_renta: "",

      monto_entrega_tardia: ""

    });

  const cargarDatos =
  async () => {

    const descripcionRes =
      await api.get(
        "/descripciones-articulo"
      );

    const tiposRes =
      await api.get(
        "/tipos-articulo"
      );

    const idiomasRes =
      await api.get(
        "/idiomas"
      );

    setRegistros(
      descripcionRes.data
    );

    setTipos(
      tiposRes.data
    );

    setIdiomas(
      idiomasRes.data
    );
  };

  useEffect(() => {

    cargarDatos();

  }, []);

  const handleChange =
  (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });

  };

  const guardar = async () => {

    if (
      !form.titulo.trim() ||
      !form.tipo_articulo_id ||
      !form.idioma_id ||
      !form.renta_dia ||
      !form.dias_renta ||
      !form.monto_entrega_tardia
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    if (editando) {

      await api.put(
        `/descripciones-articulo/${editando.id}`,
        form
      );

      toast.success("Descripción actualizada");

    } else {

      await api.post(
        "/descripciones-articulo",
        form
      );

      toast.success("Descripción guardada");

    }

    setEditando(null);

    setForm({
      titulo: "",
      tipo_articulo_id: "",
      idioma_id: "",
      renta_dia: "",
      dias_renta: "",
      monto_entrega_tardia: ""
    });

    cargarDatos();
  };

  const editar =
  (registro) => {

    setEditando(registro);

    setForm({

      titulo:
        registro.titulo,

      tipo_articulo_id:
        registro.tipo_articulo_id,

      idioma_id:
        registro.idioma_id,

      renta_dia:
        registro.renta_dia,

      dias_renta:
        registro.dias_renta,

      monto_entrega_tardia:
        registro.monto_entrega_tardia

    });
  };

  const cambiarEstado =
  async (id) => {

    await api.put(
      `/descripciones-articulo/${id}/estado`
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
        `/descripciones-articulo/${id}`
      );

      toast.success(
        "Descripcion eliminada"
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
          Gestión de Descripción de Artículos
        </h1>

        <p className="text-zinc-400 mt-2">
          Administración de Artículos
        </p>

      </div>

      <div className="netflix-card mb-5">

        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          className="netflix-input"
        />

        <select
          name="tipo_articulo_id"
          value={form.tipo_articulo_id}
          onChange={handleChange}
          className="netflix-input"
        >

          <option value="">
            Seleccione
          </option>

          {
            tipos.map(tipo => (

              <option
                key={tipo.id}
                value={tipo.id}
              >
                {tipo.descripcion}
              </option>

            ))
          }

        </select>

        <select
          name="idioma_id"
          value={form.idioma_id}
          onChange={handleChange}
          className="netflix-input"
        >

          <option value="">
            Seleccione
          </option>

          {
            idiomas.map(idioma => (

              <option
                key={idioma.id}
                value={idioma.id}
              >
                {idioma.descripcion}
              </option>

            ))
          }

        </select>

        <input
          type="number"
          name="renta_dia"
          placeholder="Renta x Día"
          value={form.renta_dia}
          onChange={handleChange}
          className="netflix-input"
        />

        <input
          type="number"
          name="dias_renta"
          placeholder="Días Renta"
          value={form.dias_renta}
          onChange={handleChange}
          className="netflix-input"
        />

        <input
          type="number"
          name="monto_entrega_tardia"
          placeholder="Monto Entrega Tardía"
          value={form.monto_entrega_tardia}
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
            <th>Título</th>
            <th>Tipo</th>
            <th>Idioma</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {
            registros.map(r => (

              <tr

            key={r.id}

            className={

                r.id === highlightId

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


                <td>{r.id}</td>

                <td>{r.titulo}</td>

                <td>
                  {r.tipo_articulo}
                </td>

                <td>
                  {r.idioma}
                </td>

                <td>
                  {
                    r.estado ? (
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
                      editar(r)
                    }
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      cambiarEstado(r.id)
                    }
                  >
                    {
                      r.estado
                      ? "Desactivar"
                      : "Activar"
                    }
                  </button>

                  <button
                    onClick={() => eliminar(r.id) } 
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

export default DescripcionArticulos;