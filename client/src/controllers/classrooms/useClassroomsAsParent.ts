import { useProgresses, useTerms } from 'controllers';
import { useGlobalStore } from 'store';
import classroomsReducer from 'store/classrooms';

const { actions } = classroomsReducer;

const useClassroomsAsParent = (classroomId?: string) => {
  console.log('classroomId', classroomId);

  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state } = useGlobalStore();

  // List of states.
  const { classrooms } = state;

  // List of actions.
  const {} = actions;

  // List of controllers;
  const Terms = useTerms(classroomId);
  const Progresses = useProgresses(classroomId);

  return {
    ...classrooms,
    terms: Terms,
    progresses: Progresses,
  };
};

export default useClassroomsAsParent;
