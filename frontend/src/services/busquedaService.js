import api from "./api";

export async function buscar(texto) {

    const { data } = await api.get(

        "/busqueda",

        {

            params: {

                q: texto

            }

        }

    );

    return data;

}