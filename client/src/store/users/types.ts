// User interface
export interface IUser {
  loggedIn: boolean | null;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface IUserInputs {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
  confirmPassword: string;
}

// State interface
export interface IUserState {
  /* Current logged user */
  current: IUser;
}

// Actions' type
export enum USERS {
  SET_USER = 'SET_USER',
}

// Dispatchers interface. Actions to update the state
export type IUserAction = { type: USERS.SET_USER; payload: IUser };

// Update user interface
export type IUserUpdate = Partial<IUser> & { oldPassword?: string } & { newPassword?: string };

// Sign up interface
export type IUserSignUp = IUserInputs;

// Sign in interface
export interface IUserSignIn {
  username: string;
  password: string;
}

export type IUserSendResetPassword = Pick<IUserInputs, 'email'>;

export type IUserConfirmResetPassword = Pick<IUserInputs, 'password' | 'confirmPassword'> & {
  token: string | string[] | null;
};
