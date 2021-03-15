import * as React from 'react';
import { UserAPI } from 'api';
import { useGlobalStore } from 'store';
import usersReducer from '../../store/users';
import { IUserState, USERS } from 'store/users/types';

const { actions } = usersReducer;

interface IUseUsers extends IUserState {
  authCheck: (cookie: string) => void;
}

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
  }, []);

  return { ...users, authCheck };
};

export default useUsers;
