import React, { createContext, useContext, useState, useEffect } from "react";


export const StoreContext = createContext();
const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
    }
  }, []);


  return (
    <StoreContext.Provider value={{ token, setToken }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;