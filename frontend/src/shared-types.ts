export interface IAppContext {
  isLoggedIn: boolean;
  authData: {
    success: boolean;
    message: string;
    data: {
      userId: string;
    };
  };
}

export interface IRegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export interface ILoginForm{
  email:string
  password:string
}

export interface IRegisterResponse {
  message: string;
  name?: string;
  success: boolean;
  data?: any
}

export interface ICommonResponse extends IRegisterResponse{}


