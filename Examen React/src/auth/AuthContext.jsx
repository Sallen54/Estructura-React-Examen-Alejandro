import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const urlApi = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);
let logoutTimer;

export function ClientAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (jwt) => {
    const decoded = jwtDecode(jwt);

    localStorage.setItem("token", jwt);
    setToken(jwt);
    axios.get(`{urlApi}/auth/me`,{
      headers: {
        Accept : 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    }).then (response => {
      localStorage.setItem("user", JSON.stringify(response.data.data));
      setClient(response.data.data);
    });
    //setClient(decoded);

    startLogoutTimer(decoded.exp);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("user");
    setToken(null);
    setClient(null);
    clearTimeout(logoutTimer);
  };

  const startLogoutTimer = (exp) => {
    const expiresInMs = exp * 1000 - Date.now();
    if (expiresInMs <= 0) return logout();
    logoutTimer = setTimeout(logout, expiresInMs);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("client_token");
    if (!storedToken) return;

    try {
      const decoded = jwtDecode(storedToken);

      if (decoded.exp * 1000 < Date.now()) return logout();

      setToken(storedToken);
      setClient(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("client_info")) : null);
      startLogoutTimer(decoded.exp);
    } catch {
      logout();
    }
   

  }, []);
  

  return (
    <ClientAuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export const useClientAuth = () => useContext(ClientAuthContext);
