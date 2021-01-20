export interface IUserProfile {
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
