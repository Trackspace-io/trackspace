import classroomReducer from './classrooms';
import { IClassroomState } from './classrooms/types';
import messagesReducer from './messages';
import { IMessageState } from './messages/types';
import { logger } from './middlewares';
import studentsReducer from './students';
import { IStudentState } from './students/types';
import subjectsReducer from './subjects';
import { ISubjectState } from './subjects/types';
import teachersReducer from './teachers';
import { ITeacherState } from './teachers/types';
import termsReducer from './terms';
import { ITermState } from './terms/types';
import usersReducer from './users';
import { IUserState } from './users/types';
import invitationsReducer from './invitations';
import { IInvitationState } from './invitations/types';
export interface IState {
  teachers: ITeacherState;
  students: IStudentState;
  users: IUserState;
  messages: IMessageState;
  classrooms: IClassroomState;
  subjects: ISubjectState;
  terms: ITermState;
  invitations: IInvitationState;
}

export const initialState: IState = {
  teachers: teachersReducer.initialState,
  students: studentsReducer.initialState,
  users: usersReducer.initialState,
  messages: messagesReducer.initialState,
  classrooms: classroomReducer.initialState,
  subjects: subjectsReducer.initialState,
  terms: termsReducer.initialState,
  invitations: invitationsReducer.initialState,
};

const rootReducer = (state: IState, actions: any): IState => {
  // Receiving previous state here
  const { users, teachers, students, messages, classrooms, subjects, terms, invitations } = state;

  // Receiving current state here
  const currentState = {
    users: usersReducer.reducer(users, actions),
    teachers: teachersReducer.reducer(teachers, actions),
    students: studentsReducer.reducer(students, actions),
    messages: messagesReducer.reducer(messages, actions),
    classrooms: classroomReducer.reducer(classrooms, actions),
    terms: termsReducer.reducer(terms, actions),
    subjects: subjectsReducer.reducer(subjects, actions),
    invitations: invitationsReducer.reducer(invitations, actions),
  };

  // Middlewares
  logger(actions, state, currentState);

  return currentState;
};

export default rootReducer;
