import React from "react";
import { AppContext } from "../context/AppContext";

export const useAppContext = () => {
  return React.useContext(AppContext);
};
