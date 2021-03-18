import * as React from 'react';
import { IStudentInvitationInfo } from 'store/students/types';
import { IClassroom } from 'store/classrooms/types';

/* Interface */

/**
 * Student state
 */
export interface IStudentState {
  /* List of classrooms */
  classroomsList: IClassroom[];
  invitationInfo: IStudentInvitationInfo;
}

/**
 * Dispatchers. Actions that update the state.
 */
export type IStudentActions =
  | { type: 'GET_CLASSROOMS'; payload: IClassroom[] }
  | { type: 'GET_INVITATION_INFO'; payload: IStudentInvitationInfo };

interface IStudentContext {
  state: IStudentState;
  dispatch: (action: IStudentActions) => void;
}

/**
 * Initial state.
 */
const initialState: IStudentState = {
  classroomsList: [],
  invitationInfo: {
    classroomName: '',
    teacherFirstName: '',
    teacherLastName: '',
  },
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
    case 'GET_INVITATION_INFO':
      return { ...state, invitationInfo: action.payload };
    // default:
    //   throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IStudentContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(studentReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Ctx, Provider };
