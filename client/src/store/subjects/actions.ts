import { ISubject, SUBJECTS } from './types';

export const setSubjects = (payload: ISubject[]) => {
  return {
    type: SUBJECTS.SET_SUBJECTS,
    payload,
  };
};
