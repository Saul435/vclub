import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
    <Toaster position="top-right"/>
  </React.StrictMode>
);