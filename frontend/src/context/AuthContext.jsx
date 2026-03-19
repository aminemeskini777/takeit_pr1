import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.token;
    const authUser = res.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authUser));

    setUser(authUser);

    return authUser;
  };

  
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    
    } catch (e) {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};