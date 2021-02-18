import * as React from 'react';
import { IClassroom } from 'types';

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
export type ClassroomAction = { type: 'GET_CLASSROOM'; payload: IClassroom[] };

interface IClassroomContext {
  state: ClassroomState;
  dispatch: (action: ClassroomAction) => void;
}

/**
 * Initial state.
 */
const initialState: ClassroomState = {
  list: [
    {
      id: 'c1',
      name: 'classroom1',
      teacherId: 't1',
    },
    {
      id: 'c2',
      name: 'classroom2',
      teacherId: 't2',
    },
  ],
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
    case 'GET_CLASSROOM':
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
