import { IClassroomState } from './classrooms/types';
import messagesReducer from './messages';
import { IMessageState } from './messages/types';
import { logger } from './middlewares';
import teachersReducer from './teachers';
import { ITeacherState } from './teachers/types';
import usersReducer from './users';
import { IUserState } from './users/types';
import classroomReducer from './classrooms';

export interface IState {
  teachers: ITeacherState;
  users: IUserState;
  messages: IMessageState;
  classrooms: IClassroomState;
}

export const initialState: IState = {
  teachers: teachersReducer.initialState,
  users: usersReducer.initialState,
  messages: messagesReducer.initialState,
  classrooms: classroomReducer.initialState,
};

const rootReducer = (state: IState, actions: any): IState => {
  // Receiving previous state here
  const { teachers, users, messages, classrooms } = state;

  // Receiving current state here
  const currentState = {
    teachers: teachersReducer.reducer(teachers, actions),
    users: usersReducer.reducer(users, actions),
    messages: messagesReducer.reducer(messages, actions),
    classrooms: classroomReducer.reducer(classrooms, actions),
  };

  // Middlewares
  logger(actions, state, currentState);

  return currentState;
};

export default rootReducer;
