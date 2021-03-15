/* States and props */
export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface IUserSignUp {
  email: string;
  lastName: string;
  firstName: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface IUserSignIn {
  username: string;
  password: string;
}

export interface IUserSendResetPassword {
  email: string;
}

export interface IUserConfirmResetPassword {
  token: string | string[] | null;
  password: string;
  confirmPassword: string;
}
export interface IUserUpdate {
  email?: string;
  firstName?: string;
  lastName?: string;
  oldPassword?: string;
  newPassword?: string;
}
