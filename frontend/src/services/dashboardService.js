import api from "./api";

export const obtenerDashboard = async () => {

    const response = await api.get(
        "/dashboard/resumen"
    );

    return response.data;

};