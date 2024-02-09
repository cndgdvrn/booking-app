import React from "react";

interface IAppContext {}

export const AppContext = React.createContext<IAppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};


