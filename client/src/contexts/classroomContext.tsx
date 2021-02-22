import * as React from 'react';
import { IClassroom, IStudent, ISubject } from 'types';
console.log('context');

/* Interface */

/**
 * Classroom state
 */
export interface ClassroomState {
  /* List of classrooms */
  studentsList: IStudent[];
  subjectsList: ISubject[];
  current: Partial<IClassroom>;
}

/**
 * Dispatchers. Actions that update the state.
 */
export type ClassroomAction =
  | { type: 'GET_STUDENTS'; payload: IStudent[] }
  | { type: 'GET_SUBJECTS'; payload: ISubject[] };

interface IClassroomContext {
  state: ClassroomState;
  dispatch: (action: ClassroomAction) => void;
}

/**
 * Initial state.
 */
const initialState: ClassroomState = {
  studentsList: [],
  subjectsList: [],
  current: {},
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
    case 'GET_STUDENTS':
      return { ...state, studentsList: action.payload };
    case 'GET_SUBJECTS':
      return { ...state, subjectsList: action.payload };
    // default:
    //   throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IClassroomContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(classroomReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Ctx, Provider };
