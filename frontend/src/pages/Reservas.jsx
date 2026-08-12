import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import toast from "react-hot-toast";

function Reservas() {

  const [cedula, setCedula] = useState("");
  const [cliente, setCliente] = useState(null);

  const [articulos, setArticulos] = useState([]);
  const [reservas, setReservas] = useState([]);

  const [articuloSeleccionado, setArticuloSeleccionado] =
    useState("");

  const cargarDatos = async () => {

    try {

      const articulosRes =
        await api.get("/descripciones-articulo");

      const reservasRes =
        await api.get("/reservas");

      setArticulos(articulosRes.data);
      setReservas(reservasRes.data);

    } catch (error) {

      toast.error(
        "Error cargando los datos"
      );

    }

  };


  useEffect(() => {

    cargarDatos();

  }, []);


  const buscarCliente = async () => {

    if (!cedula.trim()) {

      toast.error(
        "Digite una cédula"
      );

      return;
    }

    try {

      const response =
        await api.get(
          `/reservas/cliente/${cedula}`
        );

      setCliente(response.data);

      toast.success(
        "Cliente encontrado"
      );

    } catch (error) {

      setCliente(null);

      toast.error(
        error.response?.data?.error ||
        "Cliente no encontrado"
      );

    }

  };


  const calcularDisponibles = (articulo) => {

    const reservadas =
      reservas.filter(
        reserva =>
          reserva.descripcion_articulo_id ===
          articulo.id &&
          reserva.estado === true
      ).length;

    return articulo.unidades - reservadas;

  };


  const reservar = async () => {

    if (!cliente) {

      toast.error(
        "Primero busque un cliente"
      );

      return;
    }

    if (!articuloSeleccionado) {

      toast.error(
        "Seleccione un artículo"
      );

      return;
    }

    const articulo =
      articulos.find(
        a =>
          a.id ===
          Number(articuloSeleccionado)
      );

    if (!articulo) return;


    const disponibles =
      calcularDisponibles(articulo);


    if (disponibles <= 0) {

      toast.error(
        "No hay unidades disponibles"
      );

      return;
    }


    try {

      await api.post(
        "/reservas",
        {
          cliente_id: cliente.id,

          descripcion_articulo_id:
            articulo.id
        }
      );


      toast.success(
        "Reserva registrada correctamente"
      );


      setArticuloSeleccionado("");

      cargarDatos();


    } catch (error) {

      toast.error(
        error.response?.data?.error ||
        "Error creando la reserva"
      );

    }

  };


  const cambiarEstado = async (id) => {

    try {

      await api.put(
        `/reservas/${id}/estado`
      );

      toast.success(
        "Reserva actualizada"
      );

      cargarDatos();

    } catch (error) {

      toast.error(
        "Error actualizando la reserva"
      );

    }

  };

  const generarReporte = async () => {

  try {

    const response = await api.get(
      "/reservas/reporte",
      {
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob(
        [response.data],
        {
          type: "application/pdf"
        }
      )
    );

    const enlace =
      document.createElement("a");

    enlace.href = url;

    enlace.download =
      "reporte_reservas.pdf";

    document.body.appendChild(
      enlace
    );

    enlace.click();

    enlace.remove();

    window.URL.revokeObjectURL(url);

    toast.success(
      "Reporte generado correctamente"
    );

  } catch (error) {

    toast.error(
      "Error generando el reporte"
    );

  }

};


  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: .4
      }}
    >

      {/* ENCABEZADO */}

      <div className="netflix-card mb-6">

        <h1 className="text-3xl font-bold">
          Gestión de Reservas
        </h1>

        <p className="text-zinc-400 mt-2">
          Reserva de artículos para clientes
        </p>

      </div>


      {/* BUSCAR CLIENTE */}

      <div className="netflix-card mb-5">

        <h2 className="text-xl font-bold mb-4">
          Buscar Cliente
        </h2>


        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Digite la cédula"
            value={cedula}
            onChange={(e) =>
              setCedula(e.target.value)
            }
            className="netflix-input"
          />


          <button
            onClick={buscarCliente}
            className="netflix-button"
          >
            Buscar
          </button>

        </div>


        {/* CLIENTE ENCONTRADO */}

        {cliente && (

          <div className="mt-5 p-4 rounded-lg bg-zinc-800">

            <p>
              <strong>Cliente:</strong>{" "}
              {cliente.nombre}
            </p>

            <p>
              <strong>Cédula:</strong>{" "}
              {cliente.cedula}
            </p>

            <p>
              <strong>Tipo:</strong>{" "}
              {cliente.tipo_persona}
            </p>

          </div>

        )}

      </div>


      {/* REALIZAR RESERVA */}

      <div className="netflix-card mb-5">

        <h2 className="text-xl font-bold mb-4">
          Realizar Reserva
        </h2>


        <select
          value={articuloSeleccionado}
          onChange={(e) =>
            setArticuloSeleccionado(
              e.target.value
            )
          }
          className="netflix-input"
        >

          <option value="">
            Seleccione un artículo
          </option>


          {articulos
            .filter(
              articulo =>
                articulo.estado === true
            )
            .map(articulo => {

              const disponibles =
                calcularDisponibles(
                  articulo
                );

              return (

                <option
                  key={articulo.id}
                  value={articulo.id}
                  disabled={
                    disponibles <= 0
                  }
                >

                  {articulo.titulo}
                  {" - "}
                  {disponibles > 0
                    ? `${disponibles} disponibles`
                    : "AGOTADO"
                  }

                </option>

              );

            })}

        </select>


        <button
          onClick={reservar}
          className="netflix-button mt-4"
        >
          Reservar
        </button>

      </div>


      {/* DISPONIBILIDAD */}

      <div className="netflix-card mb-5">

        <h2 className="text-xl font-bold mb-4">
          Disponibilidad
        </h2>


        <table className="netflix-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Artículo</th>

              <th>Unidades</th>

              <th>Disponibles</th>

              <th>Estado</th>

            </tr>

          </thead>


          <tbody>

            {articulos
              .filter(
                articulo =>
                  articulo.estado === true
              )
              .map(articulo => {

                const disponibles =
                  calcularDisponibles(
                    articulo
                  );

                return (

                  <tr key={articulo.id}>

                    <td>
                      {articulo.id}
                    </td>

                    <td>
                      {articulo.titulo}
                    </td>

                    <td>
                      {articulo.unidades}
                    </td>

                    <td>
                      {disponibles}
                    </td>

                    <td>

                      {disponibles > 0 ? (

                        <span className="text-green-600">
                          Disponible
                        </span>

                      ) : (

                        <span className="text-red-600">
                          Agotado
                        </span>

                      )}

                    </td>

                  </tr>

                );

              })}

          </tbody>

        </table>

      </div>


      {/* RESERVAS */}

      <div className="netflix-card">

        <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-bold">
            Reservas Registradas
            </h2>

            <button
            onClick={generarReporte}
            className="netflix-button"
            >
            📄 Generar Reporte
            </button>

        </div>

        <table className="netflix-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Cliente</th>

              <th>Artículo</th>

              <th>Fecha</th>

              <th>Estado</th>

              <th>Acción</th>

            </tr>

          </thead>


          <tbody>

            {reservas.map(reserva => (

              <tr key={reserva.id}>

                <td>
                  {reserva.id}
                </td>

                <td>
                  {reserva.cliente}
                </td>

                <td>
                  {reserva.titulo}
                </td>

                <td>
                  {reserva.fecha_reserva
                    ? new Date(
                        reserva.fecha_reserva
                      ).toLocaleString()
                    : "-"
                  }
                </td>

                <td>

                  {reserva.estado ? (

                    <span className="text-green-600">
                      Reservado
                    </span>

                  ) : (

                    <span className="text-red-600">
                      Devuelto
                    </span>

                  )}

                </td>

                <td>

                  {reserva.estado && (

                    <button
                      onClick={() =>
                        cambiarEstado(
                          reserva.id
                        )
                      }
                    >
                      Devolver
                    </button>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </motion.div>

  );

}

export default Reservas;