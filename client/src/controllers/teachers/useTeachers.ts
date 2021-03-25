import { TeachersAPI } from 'api';
import { useMessages, useUsers } from 'controllers';
import * as React from 'react';
import { useGlobalStore } from 'store';
import { ITeacherGenerateLink } from 'store/teachers/types';

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
        console.log('getClassroom', data);

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Generate an invitation link to add students to a classroom.
   *
   * @param   {number} payload.expiresIn  Number of seconds after which the link will
   *                                      expire. If empty, the link will never expire.
   *
   * @param   {string} payload.id         The classroom id.
   *
   * @returns Promise
   */
  const generateLink = async (payload: ITeacherGenerateLink): Promise<any> => {
    return new Promise((resolve) => {
      TeachersAPI.generateLink(payload)
        .then((response) => {
          const { data } = response;

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  React.useEffect(() => {
    Users.current.loggedIn && getClassrooms();
  }, [Users.current.loggedIn]);

  return {
    ...teachers,
    getClassrooms,
    generateLink,
  };
};

export default useTeachers;
