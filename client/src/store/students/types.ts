import { IClassroom } from '../classrooms/types';

/**
 * Student state interface
 */
export interface IStudent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Reducer's state interface
 */
export interface IStudentState {
  // List of students
  list: IStudent[];

  // A student's list of classrooms.
  classroomsList: IClassroom[];
}

/**
 * Actions' type
 */
export enum STUDENTS {
  SET_STUDENTS = 'SET_STUDENTS',
  SET_CLASSROOMS = 'SET_CLASSROOMS',
}

/**
 * Reducer's dispatchers interface
 */
export type IStudentActions =
  | { type: STUDENTS.SET_STUDENTS; payload: IStudent[] }
  | { type: STUDENTS.SET_CLASSROOMS; payload: IClassroom[] };

export interface IStudentAcceptInvitation {
  token: string;
}

export interface IStudentInvitationBySignIn {
  token: string;
  username: string;
  password: string;
}

export interface IStudentInvitationBySignUp {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

/**
 * Remove student from classroom interface
 */
export interface IStudentRemove {
  classroomId: string;
  studentId: string;
}
