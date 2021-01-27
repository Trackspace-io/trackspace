import { UserAPI } from 'api';
import { UserContext } from 'contexts/userContext';
import * as React from 'react';
import { IUser, IUserSignIn } from 'types';
import { useHistory } from 'react-router-dom';

interface IUserController {
  user: Partial<IUser>;
  login: (input: IUserSignIn) => void;
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
      history.replace(data.redirect);
      context.dispatch({ type: 'LOGIN' });
    });
  };

  return {
    user: context.state.user,
    login: login,
  };
};

export default useUser;
