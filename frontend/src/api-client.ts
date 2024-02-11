import axios from "axios";
import { ILoginForm, IRegisterForm } from "./shared-types";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api_client = {
  register: async (formData: IRegisterForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dt } = formData;
    const response = await axios.post(`${VITE_API_BASE_URL}/api/v1/auth/register`, dt, {
      withCredentials: true,
    });
    return response.data;
  },
  login: async (formData: ILoginForm) => {
    const response = await axios.post(`${VITE_API_BASE_URL}/api/v1/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  },
  logout: async () => {
    const response = await axios.post(`${VITE_API_BASE_URL}/api/v1/auth/logout`, null, {
      withCredentials: true,
    });
    return response.data;
  },
  validateToken: async () => {
    const response = await axios.get(`${VITE_API_BASE_URL}/api/v1/auth/validate-token`, {
      withCredentials: true,
    });
    return response.data;
  },
};
