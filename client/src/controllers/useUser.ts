import { UserAPI } from 'api';
import { UserContext } from 'contexts/userContext';
import Cookies from 'js-cookie';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IUser, IUserSignIn } from 'types';

interface IUserController {
  user: Partial<IUser>;
  isAuthenticated: boolean;
  login: (input: IUserSignIn) => void;
  logout: () => void;
}

const useUser = (): IUserController => {
  const context = React.useContext(UserContext);
  const history = useHistory();

  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }

  React.useEffect(() => {
    UserAPI.get().then((response) => {
      context.dispatch({ type: 'GET_USER', payload: response });
    });
  }, [context.state.isAuthenticated]);

  const login = (input: IUserSignIn) => {
    UserAPI.login(input).then((data) => {
      context.dispatch({ type: 'LOGIN' });
      history.replace(data.redirect);
    });
  };

  const logout = () => {
    UserAPI.logout().then((data) => {
      context.dispatch({ type: 'LOGOUT' });
      Cookies.remove('connect.sid');
      history.replace(data.redirect);
    });
  };

  return {
    user: context.state.user,
    isAuthenticated: context.state.isAuthenticated,
    login: login,
    logout: logout,
  };
};

export default useUser;
