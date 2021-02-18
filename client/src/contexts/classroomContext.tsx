import * as React from 'react';
import { IClassroom } from 'types';
console.log('context');

/* Interface */

/**
 * Classroom state
 */
export interface ClassroomState {
  /* List of classrooms */
  list: IClassroom[];
}

/**
 * Dispatchers. Actions that update the state.
 */
export type ClassroomAction = { type: 'GET'; payload: IClassroom[] };

interface IClassroomContext {
  state: ClassroomState;
  dispatch: (action: ClassroomAction) => void;
}

/**
 * Initial state.
 */
const initialState: ClassroomState = {
  list: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {MessageState} state    Initial state.
 * @param {MessageAction} action  Dispatchers.
 *
 * @returns The current state
 */
const classroomReducer = (state: ClassroomState, action: ClassroomAction): ClassroomState => {
  switch (action.type) {
    case 'GET':
      return { ...state, list: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IClassroomContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(classroomReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Ctx, Provider };
