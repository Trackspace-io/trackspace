import { TeachersAPI } from 'api';
import { useMessages, useUsers } from 'controllers';
import * as React from 'react';
import { useGlobalStore } from 'store';

import teachersReducer from '../../store/teachers';

const { actions } = teachersReducer;

const useTeachers = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Users = useUsers();
  const Messages = useMessages();

  // List of states
  const { teachers } = state;

  // List of actions
  const { setClassrooms } = actions;

  // List of thunks

  /**
   * Get the list of classrooms of the teacher.
   *
   * @param   none.
   *
   * @returns void
   */
  const getClassrooms = () => {
    TeachersAPI.getClassrooms()
      .then((response) => {
        const { data } = response;

        dispatch(setClassrooms(data));
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  React.useEffect(() => {
    Users.isLogged && getClassrooms();
  }, [Users.isLogged]);

  return { ...teachers, getClassrooms };
};

export default useTeachers;
