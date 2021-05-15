import { UserAPI } from 'api';
import { useMessages } from 'controllers';
import * as React from 'react';
import { useGlobalStore } from 'store';
import usersReducer from 'store/users';
import { IUserUpdate } from 'store/users/types';

const { actions } = usersReducer;

const useUsers = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();

  // List of states
  const { users } = state;

  // List of actions
  const { setUser, setCurrentUser } = actions;

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

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  const getCurrent = () => {
    UserAPI.getCurrent()
      .then((response) => {
        const { data } = response;

        dispatch(setCurrentUser(data));
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
  const update = (payload: IUserUpdate) => {
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

  React.useEffect(() => {
    getCurrent();
  }, []);

  return { ...users, update, getCurrent };
};

export default useUsers;
