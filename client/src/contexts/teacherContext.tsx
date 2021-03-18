import * as React from 'react';
import { IClassroom } from 'store/classrooms/types';

/* Interface */

/**
 * Student state
 */
export interface ITeacherState {
  /* List of classrooms */
  classroomsList: IClassroom[];
}

/**
 * Dispatchers. Actions that update the state.
 */
export type ITeacherActions = { type: 'GET'; payload: IClassroom[] };

interface ITeacherContext {
  state: ITeacherState;
  dispatch: (action: ITeacherActions) => void;
}

/**
 * Initial state.
 */
const initialState: ITeacherState = {
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
const teacherReducer = (state: ITeacherState, action: ITeacherActions): ITeacherState => {
  switch (action.type) {
    case 'GET':
      return { ...state, classroomsList: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<ITeacherContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(teacherReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Ctx, Provider };
