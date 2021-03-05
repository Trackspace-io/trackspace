export interface IStudentInvitation {
  token: string;
}

export interface IStudentInvitationInfo {
  classroomName: string;
  teacherFirstName: string;
  teacherLastName: string;
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