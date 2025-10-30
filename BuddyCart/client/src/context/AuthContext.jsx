import React,{ createContext, useContext, useState, useEffect, Children } from "react";
import axios from "axios";
import {API_BASE} from "../config/api"

const AuthContext=createContext();


export const useAuth=()=>useContext(AuthContext);
export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null);
    const[token,setToken]=useState(localStorage.getItem("token") || null)

useEffect(() => {axios.defaults.baseURL=API_BASE.replace(/\/+$/, "");},[]);


useEffect(()=>{
    if(token){
        axios.defaults.headers.common["Authorization"]=`Bearer ${token}`   
    }else{
        delete axios.defaults.headers.common["Authorization"];
    }       
},[token]);

const loginUser=(token,user)=>{
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
}

const logOut=()=>{
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
}

useEffect(() => {
    const id = axios.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err?.response?.status === 401) logOut();
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

const value = {
    user,
    token,
    loginUser,
    logOut,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;}
