import { TEACHERS } from './types';
import { IClassroom } from '../classrooms/types';

export const setClassrooms = (payload: IClassroom[]) => {
  return {
    type: TEACHERS.SET_CLASSROOMS,
    payload,
  };
};
