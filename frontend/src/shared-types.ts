export interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IRegisterResponse {
  message: string;
  name: string;
  success: boolean;
}

