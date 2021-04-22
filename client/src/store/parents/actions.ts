import { IStudent } from 'store/students/types';
import { PARENTS } from './types';

export const setChildren = (payload: IStudent[]) => {
  return {
    type: PARENTS.SET_CHILDREN,
    payload,
  };
};
