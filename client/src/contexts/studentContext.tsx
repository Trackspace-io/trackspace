import * as React from 'react';
import { IClassroom } from 'types';

/* Interface */

/**
 * Student state
 */
export interface IStudentState {
  /* List of classrooms */
  classroomsList: IClassroom[];
}

/**
 * Dispatchers. Actions that update the state.
 */
export type IStudentActions = { type: 'GET_CLASSROOMS'; payload: IClassroom[] };

interface IStudentContext {
  state: IStudentState;
  dispatch: (action: IStudentActions) => void;
}

/**
 * Initial state.
 */
const initialState: IStudentState = {
  classroomsList: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {MessageState} state    Initial state.
 * @param {MessageAction} action  Dispatchers.
 *
 * @returns The current state
 */
const studentReducer = (state: IStudentState, action: IStudentActions): IStudentState => {
  switch (action.type) {
    case 'GET_CLASSROOMS':
      return { ...state, classroomsList: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IStudentContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(studentReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Ctx, Provider };
