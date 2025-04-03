import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LayoutBase from "./LayoutBase";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (user === null) {
    return <p className="text-center mt-10">Cargando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <LayoutBase>{children}</LayoutBase>;
}
