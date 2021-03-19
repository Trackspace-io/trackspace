// User interface
export interface IUser {
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

  /* User's logged state */
  isLogged: boolean;
}

// Actions' type
export enum USERS {
  SET_USER = 'SET_USER',
  IS_LOGGED = 'IS_LOGGED',
}

// Dispatchers interface. Actions to update the state
export type IUserAction = { type: USERS.SET_USER; payload: IUser } | { type: USERS.IS_LOGGED };

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
