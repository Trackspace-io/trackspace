import { IStudent, IStudentInvitationInfo, STUDENTS } from './types';
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

export const setInvitationInfo = (payload: IStudentInvitationInfo) => {
  return {
    type: STUDENTS.SET_INVITATION_INFO,
    payload,
  };
};
