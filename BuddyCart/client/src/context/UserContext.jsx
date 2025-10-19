import React, { createContext, useContext, useState } from "react";

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