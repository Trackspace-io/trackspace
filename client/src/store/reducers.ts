import { IClassroomState } from './classrooms/types';
import messagesReducer from './messages';
import { IMessageState } from './messages/types';
import { logger } from './middlewares';
import teachersReducer from './teachers';
import { ITeacherState } from './teachers/types';
import usersReducer from './users';
import { IUserState } from './users/types';
import classroomReducer from './classrooms';
import subjectsReducer from './subjects';
import { ISubjectState } from './subjects/types';

type IClassroomStates = IClassroomState & {
  subjects: ISubjectState;
};
export interface IState {
  teachers: ITeacherState;
  users: IUserState;
  messages: IMessageState;
  classrooms: IClassroomStates;
}

export const initialState: IState = {
  teachers: teachersReducer.initialState,
  users: usersReducer.initialState,
  messages: messagesReducer.initialState,
  classrooms: {
    ...classroomReducer.initialState,
    subjects: subjectsReducer.initialState,
  },
};

const rootReducer = (state: IState, actions: any): IState => {
  // Receiving previous state here
  const {
    teachers,
    users,
    messages,
    classrooms,
    classrooms: { subjects },
  } = state;

  // Receiving current state here
  const currentState = {
    teachers: teachersReducer.reducer(teachers, actions),
    users: usersReducer.reducer(users, actions),
    messages: messagesReducer.reducer(messages, actions),
    classrooms: {
      ...classroomReducer.reducer(classrooms, actions),
      subjects: subjectsReducer.reducer(subjects, actions),
    },
  };

  // Middlewares
  logger(actions, state, currentState);

  return currentState;
};

export default rootReducer;
