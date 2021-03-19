import { IStudent, STUDENTS } from './types';
import { IClassroom } from '../classrooms/types';

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
