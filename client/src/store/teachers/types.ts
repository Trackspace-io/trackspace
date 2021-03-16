export interface IClassroom {
  id: string;
  name: string;
  teacherId: string;
}

/**
 * Reducer's state interface
 */
export interface ITeacherState {
  /* List of classrooms */
  classroomsList: IClassroom[];
}

/**
 * Actions' type
 */
export enum TEACHERS {
  SET_CLASSROOMS = 'SET_CLASSROOMS',
}

/**
 * Reducer's dispatchers interface
 */
export type ITeacherActions = { type: TEACHERS.SET_CLASSROOMS; payload: IClassroom[] };

export interface ITeacherGenerateLink {
  classroomId: string;
  expiresIn: number;
}
