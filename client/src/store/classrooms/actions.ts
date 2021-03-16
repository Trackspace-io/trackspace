import { CLASSROOMS, IClassroom } from './types';

export const setCurrent = (payload: IClassroom) => {
  return {
    type: CLASSROOMS.SET_CURRENT,
    payload,
  };
};
