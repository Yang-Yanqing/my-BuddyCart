import { createContext, useContext, useState } from "react";

const ItemsContext = createContext(null);

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  return (
    <ItemsContext.Provider value={{ items, setItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used within <ItemsProvider>");
  return ctx;
};
