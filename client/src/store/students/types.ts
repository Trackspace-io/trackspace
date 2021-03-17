import { IClassroom } from '../classrooms/types';

/**
 * Invitation interface
 */
export interface IStudentInvitationInfo {
  classroomName: string;
  teacherFirstName: string;
  teacherLastName: string;
}

/**
 * Reducer's state interface
 */
export interface IStudentState {
  /* List of classrooms */
  classroomsList: IClassroom[];
  invitationInfo: IStudentInvitationInfo;
}

/**
 * Actions' type
 */
export enum STUDENTS {
  SET_CLASSROOMS = 'SET_CLASSROOMS',
  SET_INVITATION_INFO = 'SET_INVITATION_INFO',
}

/**
 * Reducer's dispatchers interface
 */
export type IStudentActions =
  | { type: STUDENTS.SET_CLASSROOMS; payload: IClassroom[] }
  | { type: STUDENTS.SET_INVITATION_INFO; payload: IStudentInvitationInfo };

/**
 * Student Invitation interface
 */
export interface IStudentInvitation {
  token: string;
}

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
