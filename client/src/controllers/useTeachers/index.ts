import * as React from 'react';
import { TeachersAPI } from 'api';
import { useGlobalStore } from 'store';
import teachersReducer from '../../store/teachers';
import { ITeacherState } from 'store/teachers/types';
import { useUsers } from 'controllers';

const { actions } = teachersReducer;

type IUseTeachers = ITeacherState;

const useTeachers = (): IUseTeachers => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();
  const Users = useUsers();

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
  const retrieveClassroom = () => {
    TeachersAPI.getClassrooms()
      .then((response) => {
        const { data } = response;

        dispatch(setClassrooms(data));
      })
      .catch((e) => {
        const { data } = e.response;

        console.log('error', data);
      });
  };

  React.useEffect(() => {
    Users.isLogged && retrieveClassroom();
  }, [Users.isLogged]);

  return { ...teachers };
};

export default useTeachers;
