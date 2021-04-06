import { USERS, IUser } from './types';

export const setUser = (payload: IUser) => {
  return {
    type: USERS.SET_USER,
    payload,
  };
};

export const setCurrentUser = (payload: IUser) => {
  return {
    type: USERS.SET_USER,
    payload,
  };
};

export const isLogged = () => {
  return {
    type: USERS.IS_LOGGED,
  };
};
