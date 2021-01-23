export interface IUserSignUp {
  email: string;
  lastName: string;
  firstName: string;
  password: boolean;
  confirmPassword: string;
}

export interface ISignUpProps {
  signUp: ISignUp;
}
