import { IMessageState } from './messages/types';
import { logger } from './middlewares';
import teachersReducer from './teachers';
import { ITeacherState } from './teachers/types';
import usersReducer from './users';
import { IUserState } from './users/types';
import messagesReducer from './messages';
export interface IState {
  teachers: ITeacherState;
  users: IUserState;
  messages: IMessageState;
}

export const initialState: IState = {
  teachers: teachersReducer.initialState,
  users: usersReducer.initialState,
  messages: messagesReducer.initialState,
};

const rootReducer = (state: IState, action: any): IState => {
  // Receiving previous state here
  const { teachers, users, messages } = state;

  // Receiving current state here
  const currentState = {
    teachers: teachersReducer.reducer(teachers, action),
    users: usersReducer.reducer(users, action),
    messages: messagesReducer.reducer(messages, action),
  };

  // Middlewares
  logger(action, state, currentState);

  return currentState;
};

export default rootReducer;
