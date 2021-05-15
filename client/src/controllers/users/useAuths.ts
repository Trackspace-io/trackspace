import { UserAPI } from 'api';
import { useMessages } from 'controllers';
import { useGlobalStore } from 'store';
import usersReducer from 'store/users';
import { IUserConfirmResetPassword, IUserSendResetPassword, IUserSignIn, IUserSignUp } from 'store/users/types';

const { actions } = usersReducer;

const useAuths = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();

  // List of states
  const {} = state;

  // List of actions
  const {} = actions;

  // List of thunks

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

  /**
   * Logouts the user.
   *
   * @returns void
   */
  const logout = () => {
    UserAPI.logout().then(() => {
      window.location.reload();
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
    register,
    login,
    logout,

    sendResetPassword,
    confirmResetPassword,
  };
};

export default useAuths;
