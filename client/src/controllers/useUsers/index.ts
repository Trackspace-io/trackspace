import * as React from 'react';
import { UserAPI } from 'api';
import { useGlobalStore } from 'store';
import usersReducer from '../../store/users';
import { IUserState, IUserUpdate, USERS } from 'store/users/types';

const { actions } = usersReducer;

type IUseUsers = IUserState & {
  authCheck: (cookie: string) => void;
  update: (payload: IUserUpdate) => Promise<any>;
};

const useUsers = (): IUseUsers => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of states
  const { users } = state;

  // List of actions
  const { setUser } = actions;

  // List of thunks

  /**
   * Get the current user
   *
   * @returns void
   */
  const get = () => {
    UserAPI.get()
      .then((response) => {
        const { data } = response;

        dispatch(setUser(data));
      })
      .catch((e) => {
        const { data } = e.response;

        console.log('error', data);
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
  const update = (payload: IUserUpdate) => {
    return new Promise((resolve) => {
      UserAPI.update(payload)
        .then(() => {
          get();

          // Messages.add({
          //   type: 'success',
          //   text: `Profile updated.`,
          // });

          resolve(true);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          // Messages.add({
          //   type: 'error',
          //   text: `${msg}`,
          // });
          console.log('error', msg);
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
      dispatch({ type: USERS.IS_LOGGED });
    }
  };

  React.useEffect(() => {
    users.isLogged && get();
  }, [users.isLogged]);

  return { ...users, update, authCheck };
};

export default useUsers;
