import { USERS, IUser } from './types';

export const setUser = (payload: IUser) => {
  return {
    type: USERS.SET_USER,
    payload,
  };
};
