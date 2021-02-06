import { UserAPI } from 'api';
import { UserContext } from 'contexts/userContext';
import Cookies from 'js-cookie';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IUser, IUserSignIn, IUserSignUp, IUserUpdate, IUserSendResetPassword } from 'types';
import useMessage from './useMessage';

interface IUserController {
  user: Partial<IUser>;
  isAuthenticated: boolean;

  register: (input: IUserSignUp) => void;
  login: (input: IUserSignIn) => void;
  authCheck: (cookie: string) => void;
  logout: () => void;
  sendResetPassword: (input: IUserSendResetPassword) => Promise<any>;

  updateUser: (input: IUserUpdate) => Promise<any>;
}

const useUser = (): IUserController => {
  // Get user context
  const context = React.useContext(UserContext);

  // Message controller to send notification
  const { update } = useMessage();
  const history = useHistory();

  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }

  // Fetch the user if the cookie is set.
  React.useEffect(() => {
    context.state.isAuthenticated && get();
  }, [context.state.isAuthenticated]);

  const get = () => {
    UserAPI.get()
      .then((response) => {
        const { data } = response;

        context.dispatch({ type: 'GET_USER', payload: data });
      })
      .catch((e) => {
        const { data } = e.response;

        update({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  const authCheck = (cookie: string | undefined) => {
    if (cookie) {
      context.dispatch({ type: 'AUTH_CHECK' });
    }
  };

  const register = (input: IUserSignUp) => {
    UserAPI.register(input)
      .then(() => {
        history.replace('/');
      })
      .catch((e) => {
        const { data } = e.response;

        update({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  const login = (input: IUserSignIn) => {
    UserAPI.login(input)
      .then((response) => {
        const { data } = response;

        history.go(data.redirect);
      })
      .catch((e) => {
        const { data } = e.response;

        update({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  const sendResetPassword = async (input: IUserSendResetPassword) => {
    return new Promise((resolve, reject) => {
      UserAPI.sendResetPassword(input)
        .then((response) => {
          const { data } = response;
          console.log('response', data);

          history.replace('/reset-password/confirm');
          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          update({
            type: 'error',
            text: `${msg}`,
          });

          reject();
        });
    });
  };

  const updateUser = (input: IUserUpdate) => {
    return new Promise((resolve) => {
      UserAPI.updateUser(input)
        .then(() => {
          get();

          update({
            type: 'success',
            text: `Profile updated.`,
          });

          return resolve(true);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          update({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  const logout = () => {
    UserAPI.logout().then((response) => {
      const { data } = response;

      Cookies.remove('connect.sid');
      history.go(data.redirect);

      update({
        type: 'success',
        text: `Goodbye!`,
      });
    });
  };

  const { user, isAuthenticated } = context.state;

  return {
    user: user,
    isAuthenticated: isAuthenticated,

    login: login,
    register: register,
    authCheck: authCheck,
    logout: logout,
    sendResetPassword: sendResetPassword,

    updateUser: updateUser,
  };
};

export default useUser;
