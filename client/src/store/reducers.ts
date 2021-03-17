import classroomReducer from './classrooms';
import { IClassroomState } from './classrooms/types';
import messagesReducer from './messages';
import { IMessageState } from './messages/types';
import { logger } from './middlewares';
import subjectsReducer from './subjects';
import { ISubjectState } from './subjects/types';
import teachersReducer from './teachers';
import { ITeacherState } from './teachers/types';
import termsReducer from './terms';
import { ITermState } from './terms/types';
import usersReducer from './users';
import { IUserState } from './users/types';

export interface IState {
  teachers: ITeacherState;
  users: IUserState;
  messages: IMessageState;
  classrooms: IClassroomState & {
    subjects: ISubjectState;
    terms: ITermState;
  };
}

export const initialState: IState = {
  teachers: teachersReducer.initialState,
  users: usersReducer.initialState,
  messages: messagesReducer.initialState,
  classrooms: {
    ...classroomReducer.initialState,
    subjects: subjectsReducer.initialState,
    terms: termsReducer.initialState,
  },
};

const rootReducer = (state: IState, actions: any): IState => {
  // Receiving previous state here
  const {
    teachers,
    users,
    messages,
    classrooms,
    classrooms: { subjects, terms },
  } = state;

  // Receiving current state here
  const currentState = {
    teachers: teachersReducer.reducer(teachers, actions),
    users: usersReducer.reducer(users, actions),
    messages: messagesReducer.reducer(messages, actions),
    classrooms: {
      ...classroomReducer.reducer(classrooms, actions),
      subjects: subjectsReducer.reducer(subjects, actions),
      terms: termsReducer.reducer(terms, actions),
    },
  };

  // Middlewares
  logger(actions, state, currentState);

  return currentState;
};

export default rootReducer;
