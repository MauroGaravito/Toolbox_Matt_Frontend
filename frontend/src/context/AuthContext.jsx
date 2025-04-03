import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios"; // o la ruta que te corresponda

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 NUEVO ESTADO
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const getUser = async () => {
    if (!token) {
      setUser(false);
      setLoading(false); // 👈 Finaliza la carga
      return;
    }
  
    try {
      const res = await api.get("/auth/me");

      setUser(res.data);
    } catch (err) {
      console.log("No valid session.");
      setUser(false);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false); // 👈 Siempre se ejecuta
    }
  };
  
  

  useEffect(() => {
    getUser();
  }, [token]); // 🔄 Se ejecuta cuando `token` cambia

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    await getUser(); // ⏳ Espera que se obtenga el usuario
    window.location.href = "/"; // ✅ Redirige al Home después
  };
  
  

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
