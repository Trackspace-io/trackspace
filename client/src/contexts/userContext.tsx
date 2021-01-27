import * as React from 'react';
import { IUser } from 'types';

export interface UserState {
  user: Partial<IUser>;
  isAuthenticated: boolean;
}

export type UserAction =
  | { type: 'GET_USER'; payload: IUser }
  | { type: 'EDIT_USER'; payload: Partial<IUser> }
  | { type: 'LOGIN' };

interface IUserContext {
  state: UserState;
  dispatch: (action: UserAction) => void;
}

const initialState: UserState = {
  user: {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  },
  isAuthenticated: false,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'GET_USER':
      return { ...state, user: action.payload };
    case 'LOGIN':
      return { ...state, isAuthenticated: true };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const UserContext = React.createContext<IUserContext | undefined>(undefined);

const UserContextProvider = UserContext.Provider;

const UserContextConsumer = UserContext.Consumer;

const UserProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return <UserContextProvider value={{ state, dispatch }}> {children} </UserContextProvider>;
};

export { UserProvider, UserContextProvider, UserContextConsumer, UserContext };
