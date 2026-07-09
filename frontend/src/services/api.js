import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json"
    }
});



api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access_token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});



api.interceptors.response.use(

    response => response,

    async (error) => {

        const original = error.config;


        if (

            error.response?.status === 401 &&

            !original._retry &&

            !original.url.includes("/auth/login")

        ) {


            original._retry = true;


            const refresh = localStorage.getItem(
                "refresh_token"
            );


            if (!refresh) {

                cerrarSesion();

                return Promise.reject(error);

            }


            try {

                const respuesta = await axios.post(

                    "http://localhost:5000/auth/refresh",

                    {},

                    {

                        headers: {

                            Authorization:
                            `Bearer ${refresh}`

                        }

                    }

                );


                localStorage.setItem(

                    "access_token",

                    respuesta.data.access_token

                );


                original.headers.Authorization =

                    `Bearer ${respuesta.data.access_token}`;


                return api(original);


            }

            catch {

                cerrarSesion();

            }

        }


        return Promise.reject(error);

    }

);


function cerrarSesion() {

    localStorage.removeItem("access_token");

    localStorage.removeItem("refresh_token");

    localStorage.removeItem("usuario");

    window.location.href = "/login";

}

export default api;