import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [usuario, setUsuario] = useState(

        JSON.parse(
            localStorage.getItem("usuario")
        ) || null

    );

    const login = (data) => {

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        localStorage.setItem(
            "refresh_token",
            data.refresh_token
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(data.usuario)
        );

        setUsuario(
            data.usuario
        );

    };


    const logout = () => {

    localStorage.clear();

    setUsuario(null);

    window.location.href = "/login";

};


    const isAuthenticated = () => {

        return !!localStorage.getItem(
            "access_token"
        );

    };


    return (

        <AuthContext.Provider

            value={{

                usuario,

                login,

                logout,

                isAuthenticated

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}