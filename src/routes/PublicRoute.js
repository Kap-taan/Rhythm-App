import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import AuthContext from "../stores/AuthContext"

function PublicAuth({ children }) {
    let auth = useContext(AuthContext);
    let location = useLocation();

    if (auth.user) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return children;
}

export default PublicAuth;