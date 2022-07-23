import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import AuthContext from "../stores/AuthContext"

function RequireAuth({ children }) {
    let auth = useContext(AuthContext);
    let location = useLocation();

    if (!auth.user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;