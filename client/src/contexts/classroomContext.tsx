import * as React from 'react';
import { IClassroom } from 'types';

/* Interface */

/**
 * Classroom state
 *
 * @param {IClassroom[]} classrooms  List of classrooms.
 */
export interface ClassroomState {
  classrooms: IClassroom[];
}

/* Actions */
export type ClassroomAction = { type: 'GET_CLASSROOM'; payload: IClassroom[] };

interface IClassroomContext {
  state: ClassroomState;
  dispatch: (action: ClassroomAction) => void;
}

const initialState: ClassroomState = {
  classrooms: [
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

const classroomReducer = (state: ClassroomState, action: ClassroomAction): ClassroomState => {
  switch (action.type) {
    case 'GET_CLASSROOM':
      return { ...state, classrooms: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IClassroomContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const CtxConsumer = Ctx.Consumer;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(classroomReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Provider, Ctx, CtxProvider, CtxConsumer };
