import axios from "axios";
import { IRegisterForm } from "./shared-types";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api_client = {
  register: async (formData: IRegisterForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dt } = formData;
    const response = await axios.post(`${VITE_API_BASE_URL}/api/v1/auth/register`, dt,{
      withCredentials: true,
    });
    return response.data;
  },
};
