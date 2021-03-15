import { TEACHERS, IClassroom } from './types';

export const setClassrooms = (payload: IClassroom[]) => {
  return {
    type: TEACHERS.SET_CLASSROOMS,
    payload,
  };
};
