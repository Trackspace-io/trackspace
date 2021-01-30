import { UserAPI } from 'api';
import { UserContext } from 'contexts/userContext';
import Cookies from 'js-cookie';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IUser, IUserSignIn, IUserUpdate } from 'types';
import useMessage from './useMessage';

interface IUserController {
  user: Partial<IUser>;
  isAuthenticated: boolean;

  updateUser: (input: IUserUpdate) => void;
  login: (input: IUserSignIn) => void;
  logout: () => void;
  authCheck: (cookie: string) => void;
}

const useUser = (): IUserController => {
  const context = React.useContext(UserContext);
  const { update } = useMessage();
  const history = useHistory();

  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }

  React.useEffect(() => {
    context.state.isAuthenticated && get();
  }, [context.state.isAuthenticated]);

  const get = () => {
    UserAPI.get().then((data) => {
      context.dispatch({ type: 'GET_USER', payload: data });
    });
  };

  const authCheck = (cookie: string | undefined) => {
    if (cookie) {
      context.dispatch({ type: 'AUTH_CHECK' });
    }
  };

  const updateUser = (input: IUserUpdate) => {
    UserAPI.updateUser(input).then(() => {
      get();
    });
  };

  const login = (input: IUserSignIn) => {
    UserAPI.login(input)
      .then((data) => {
        context.dispatch({ type: 'LOGIN' });
        history.replace(data.redirect);
        update({
          type: 'success',
          text: `Welcome back!`,
        });
      })
      .catch((e) => {
        update({
          type: 'error',
          text: `An unexpected error occurred. Please ` + `contact the system administrator (code: ${e}).`,
        });
      });
  };

  const logout = () => {
    UserAPI.logout().then((data) => {
      context.dispatch({ type: 'LOGOUT' });
      Cookies.remove('connect.sid');
      history.replace(data.redirect);
      update({
        type: 'success',
        text: `Goodbye!`,
      });
    });
  };

  return {
    user: context.state.user,
    isAuthenticated: context.state.isAuthenticated,

    updateUser: updateUser,
    login: login,
    logout: logout,
    authCheck: authCheck,
  };
};

export default useUser;
