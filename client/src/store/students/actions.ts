import { IStudent, STUDENTS } from './types';
import { IClassroom } from '../classrooms/types';
import { IParent } from 'store/parents/types';

export const setStudents = (payload: IStudent[]) => {
  return {
    type: STUDENTS.SET_STUDENTS,
    payload,
  };
};

export const setClassrooms = (payload: IClassroom[]) => {
  return {
    type: STUDENTS.SET_CLASSROOMS,
    payload,
  };
};

export const setParents = (payload: IParent) => {
  return {
    type: STUDENTS.SET_PARENTS,
    payload,
  };
};
