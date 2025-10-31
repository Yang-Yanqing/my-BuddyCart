
import axios from "axios";

const IS_PROD = /\.fly\.dev$/i.test(window.location.hostname);


export const API_BASE = IS_PROD
  ? "https://buddycart-server.onrender.com/api"
  : (process.env.REACT_APP_API_BASE_URL || "http://localhost:5005/api");

export const SOCKET_URL = IS_PROD
  ? "https://buddycart-server.onrender.com"
  : (process.env.REACT_APP_SOCKET_URL || "http://localhost:5005");

export const SOCKET_PATH = process.env.REACT_APP_SOCKET_PATH || "/socket.io";

const http = axios.create({ baseURL: API_BASE });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (typeof config.url === "string") {
    
    config.url = config.url.replace(/([^:]\/)\/+/g, "$1");
  }
  return config;
});

export default http;
