/* States and props */
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface IUserSignUp {
  email: string;
  lastName: string;
  firstName: string;
  password: boolean;
  confirmPassword: string;
  role: string;
}

export interface IUserSignIn {
  email: string;
  password: string;
}

export interface ISignUpProps {
  signUp: IUserSignUp;
}

/* Context */
export type IUserContext = {
  user: IUser;
  register: (body: IUserSignUp) => void;
  login: (body: IUserSignIn) => void;
};
