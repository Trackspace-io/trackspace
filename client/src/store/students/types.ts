import { IParent } from 'store/parents/types';
import { IClassroom } from '../classrooms/types';

/**
 * Student state interface
 */
export interface IStudent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  invitationPendingSince?: string;
  mustConfirm?: boolean;
  parents: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    confirmed: boolean;
  }[];
}

/**
 * Reducer's state interface
 */
export interface IStudentState {
  // List of students.
  list: IStudent[];

  // A student's list of classrooms.
  classroomsList: IClassroom[];

  // List of parents.
  parents: IParent[];

  // Details of a student.
  details: IStudent | null;
}

/**
 * Actions' type
 */
export enum STUDENTS {
  SET_STUDENTS = 'SET_STUDENTS',
  SET_CLASSROOMS = 'SET_CLASSROOMS',
  SET_PARENTS = 'SET_PARENTS',
  SET_DETAILS = 'SET_DETAILS',
}

/**
 * Reducer's dispatchers interface
 */
export type IStudentActions =
  | { type: STUDENTS.SET_STUDENTS; payload: IStudent[] }
  | { type: STUDENTS.SET_CLASSROOMS; payload: IClassroom[] }
  | { type: STUDENTS.SET_PARENTS; payload: IParent[] }
  | { type: STUDENTS.SET_DETAILS; payload: IStudent };

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

export interface IStudentGetParents {
  studentId: string;
}

export interface IStudentConfirmRelationship {
  studentId: string;
  parentId: string;
}

export interface IStudentAddParent {
  studentId: string;
}

export interface IStudentRemoveParent {
  studentId: string;
  parentId: string;
}
