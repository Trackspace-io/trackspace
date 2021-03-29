import { useGlobalStore } from 'store';
import React from 'react';
import { ClassroomAPI } from 'api';
import classroomsReducer from 'store/classrooms';
import { useMessages } from 'controllers';
import useProgresses from 'controllers/progresses/useProgresses';
import useTerms from 'controllers/terms/useTerms';

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

  const Terms = useTerms(classroomId);
  const Progresses = useProgresses(classroomId);

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
    // classroomId && Terms.get(classroomId);
  }, [classroomId]);

  return {
    current: { ...classrooms.current },
    terms: Terms,
    progresses: Progresses,
  };
};

export default useClassroomsAsStudent;
