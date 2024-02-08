import { IRegisterForm } from "./pages/Register";
import axios from "axios";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api_client = {
  register: async (formData: IRegisterForm) => {
    const { confirmPassword, ...dt } = formData;
    const response = await axios.post(`${VITE_API_BASE_URL}/api/v1/auth/register`, dt);
    return response.data;
  },
};
