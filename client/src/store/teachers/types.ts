export interface IClassroom {
  id: string;
  name: string;
  teacherId: string;
}

export interface ITeacherState {
  /* List of classrooms */
  classroomsList: IClassroom[];
}

export enum TEACHERS {
  SET_CLASSROOMS = 'SET_CLASSROOMS',
}

/**
 * Dispatchers. Actions that update the state.
 */
export type ITeacherActions = { type: TEACHERS.SET_CLASSROOMS; payload: IClassroom[] };

export interface ITeacherContext {
  state: ITeacherState;
  dispatch: (action: ITeacherActions) => void;
}

export interface ITeacherGenerateLink {
  classroomId: string;
  expiresIn: number;
}
