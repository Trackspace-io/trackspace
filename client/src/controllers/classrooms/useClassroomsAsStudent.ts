import { useGlobalStore } from 'store';
import React from 'react';
import { ClassroomAPI } from 'api';
import classroomsReducer from 'store/classrooms';
import { useMessages } from 'controllers';

const { actions } = classroomsReducer;

const useClassroomsAsStudent = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of states.
  const { classrooms } = state;

  // List of actions.
  const { setCurrent } = actions;

  // List of controllers.
  const Messages = useMessages();

  /**
   * Get the classroom information
   *
   * @returns void
   */
  const getCurrent = (classroomId: string) => {
    return new Promise((resolve) => {
      ClassroomAPI.getCurrent(classroomId)
        .then((response) => {
          const { data } = response;

          dispatch(setCurrent(data));

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
    classroomId && getCurrent(classroomId);
  }, [classroomId]);

  return {
    current: {
      ...classrooms.current,
    },
  };
};

export default useClassroomsAsStudent;
