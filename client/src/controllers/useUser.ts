import { UserAPI } from 'api';
import { UserContext } from 'contexts';
import Cookies from 'js-cookie';
import * as React from 'react';
import { IUser, IUserConfirmResetPassword, IUserSendResetPassword, IUserSignIn, IUserSignUp, IUserUpdate } from 'types';

import useMessages from './useMessages';

interface IUserController {
  current: IUser;
  isAuth: boolean;

  register: (payload: IUserSignUp) => void;
  login: (payload: IUserSignIn) => void;
  authCheck: (cookie: string) => void;
  logout: () => void;
  sendResetPassword: (payload: IUserSendResetPassword) => Promise<any>;
  confirmResetPassword: (payload: IUserConfirmResetPassword) => Promise<any>;
  updateUser: (payload: IUserUpdate) => Promise<any>;
}

const useUser = (): IUserController => {
  // Get user context.
  const context = React.useContext(UserContext.Ctx);

  // Message controller to send notification.
  const Messages = useMessages();

  if (context === undefined) {
    throw new Error('User context must be used within a Provider');
  }

  // States
  const { current, isAuth } = context.state;

  // Fetch the user if the cookie is set.
  React.useEffect(() => {
    isAuth && get();
  }, [isAuth]);

  /**
   * Get the list of users.
   *
   * @returns void
   */
  const get = () => {
    UserAPI.get()
      .then((response) => {
        const { data } = response;

        context.dispatch({ type: 'GET_USER', payload: data });
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Set isAuthenticated if the cookie exists.
   *
   * @param {string | undefined} cookie The session token.
   *
   * @returns void
   */
  const authCheck = (cookie: string | undefined) => {
    if (cookie) {
      context.dispatch({ type: 'AUTH_CHECK' });
    }
  };

  /**
   * Create a new user
   *
   * @param {string} input.email            The name of the user.
   * @param {string} input.firstName        The first name of the user.
   * @param {string} input.lastName         The last name of the user.
   * @param {string} input.password         The new password of the user.
   * @param {string} input.confirmPassword  The confirmed new password of the user.
   * @param {string} input.role             The role of the user.
   *
   * @returns void
   */
  const register = (payload: IUserSignUp) => {
    UserAPI.register(payload)
      .then(() => {
        window.location.replace('/');
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Update the user's information
   *
   * @param {string} input.email?            The name of the user.
   * @param {string} input.firstName?        The first name of the user.
   * @param {string} input.lastName?         The last name of the user.
   * @param {string} input.password?         The new password of the user.
   * @param {string} input.confirmPassword?  The confirmed new password of the user.
   * @param {string} input.role?             The role of the user.
   *
   * @returns Promise
   */
  const updateUser = (payload: IUserUpdate) => {
    return new Promise((resolve) => {
      UserAPI.update(payload)
        .then(() => {
          get();

          Messages.add({
            type: 'success',
            text: `Profile updated.`,
          });

          resolve(true);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  /**
   * Logs the user.
   *
   * @param {string} input.email    The name of the user.
   * @param {string} input.password The name of the user.
   *
   * @returns void
   */
  const login = (payload: IUserSignIn) => {
    UserAPI.login(payload)
      .then((response) => {
        const { data } = response;

        window.location.replace(data.redirect);
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  const logout = () => {
    UserAPI.logout().then((response) => {
      const { data } = response;

      Cookies.remove('connect.sid');
      window.location.replace(data.redirect);
    });
  };

  /**
   * Send reset password email.
   *
   * @param {string} input.email  The name of the user.
   *
   * @returns Promise
   */
  const sendResetPassword = (payload: IUserSendResetPassword) => {
    return new Promise((resolve, reject) => {
      UserAPI.sendResetPassword(payload)
        .then((response) => {
          const { data } = response;

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });

          reject();
        });
    });
  };

  /**
   * Set a new password.
   *
   * @param {string} input.token              The token params, from url.
   * @param {string} input.password           The new password.
   * @param {string} input.confirmPassword    The confirmed new password.
   *
   * @returns void
   */
  const confirmResetPassword = (payload: IUserConfirmResetPassword) => {
    return new Promise((resolve, reject) => {
      UserAPI.confirmResetPassword(payload)
        .then((response) => {
          const { data } = response;

          window.location.replace(data.redirect);

          Messages.add({
            type: 'success',
            text: 'Password reset',
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });

          reject();
        });
    });
  };

  return {
    // States
    current,
    isAuth,

    // Dispatchers
    login,
    logout,
    authCheck,
    register,
    updateUser,

    sendResetPassword,
    confirmResetPassword,
  };
};

export default useUser;
