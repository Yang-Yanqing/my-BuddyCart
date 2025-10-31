import React, { createContext, useContext, useEffect, useState } from "react";
import http from "../config/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");


  useEffect(() => {
    const id = http.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => http.interceptors.request.eject(id);
  }, [token]);

  const loginUser = (jwt, profile) => {
    setToken(jwt);
    setUser(profile);
    localStorage.setItem("token", jwt);
  };

  const logOut = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  };


  const updateMe = async (patch) => {
    const res = await http.put("/auth/me", patch);
    if (res?.data?.user) setUser(res.data.user);
    return res.data;
  };

  const value = { user, setUser, token, setToken, loginUser, logOut, updateMe, isAuthenticated: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
