 import axios from "axios";


export const API_BASE = (process.env.REACT_APP_API_BASE_URL || "/api").replace(/\/+$/, "");
 export const SOCKET_URL  = process.env.REACT_APP_SOCKET_URL  || window.location.origin;
 export const SOCKET_PATH = process.env.REACT_APP_SOCKET_PATH || "/socket.io";

 const http = axios.create({ baseURL: API_BASE });

 http.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");
   if (token) config.headers.Authorization = `Bearer ${token}`;

  if (typeof config.url === "string") {

  config.url = config.url.replace(/([^:]\/)\/+/g, "$1");

  config.url = config.url.replace(/^\/api\/api\//, "/api/");
  }
   return config;
 });
 
 export default http;
