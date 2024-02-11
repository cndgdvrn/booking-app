import React from "react";
import { useQuery } from "react-query";
import { api_client } from "../api-client";
import { IAppContext } from "../shared-types";

export const AppContext = React.createContext<IAppContext | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { isError, data } = useQuery("validate-token", api_client.validateToken, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const value = {
    isLoggedIn: !isError,
    authData: data,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
