export const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5005" 
    : "https://buddycart-server.onrender.com"); 

export const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || API_BASE;

export const SOCKET_NAMESPACE = "/chat";
export const SOCKET_PATH = "/socket.io";