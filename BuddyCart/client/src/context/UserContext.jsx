import React, {createContext,useContext,useState,useEffect} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState("customer");
  const toggleRole = () => {
    setRole((r) => (r === "admin" ? "customer" : "admin"));
  };
  return (
    <UserContext.Provider value={{ role, toggleRole }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);

export const ThemeCtx = createContext();

export const ThemeProvider = ({ children }) => {
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
  useEffect(() => {
    document.body.style.background = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }, [rgb]);
  return (
    <ThemeCtx.Provider value={{ rgb, setRgb }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export const useTheme=()=> useContext(ThemeCtx);