import * as React from 'react';
import { IUser } from 'store/users/types';

export interface UserState {
  /* Current logged user */
  current: IUser;

  /* User's logged state */
  isAuth: boolean;
}

export type UserAction = { type: 'GET_USER'; payload: IUser } | { type: 'AUTH_CHECK' };

interface IUserContext {
  state: UserState;
  dispatch: (action: UserAction) => void;
}

const initialState: UserState = {
  current: {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  },
  isAuth: false,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'GET_USER':
      return { ...state, current: action.payload };
    case 'AUTH_CHECK':
      return { ...state, isAuth: true };
    // default:
    //   throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IUserContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const CtxConsumer = Ctx.Consumer;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(userReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Provider, Ctx, CtxProvider, CtxConsumer };
