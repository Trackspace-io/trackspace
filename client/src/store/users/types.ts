// User interface
export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
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
