/**
 * Classroom interface
 */
export interface IClassroom {
  id: string;
  name: string;
  teacherId: string;
}

/**
 * Reducer's state interface
 */
export interface IClassroomState {
  // Current classroom
  current: Partial<IClassroom>;
}

/**
 * Actions' type
 */
export enum CLASSROOMS {
  SET_CURRENT = 'SET_CURRENT',
}

/**
 * Reducer's dispatchers interface
 */
export type IClassroomActions = { type: CLASSROOMS.SET_CURRENT; payload: IClassroom };

/**
 * Create classroom interface
 */
export type IClassroomCreate = Pick<IClassroom, 'name'>;

/**
 * Modify classroom interface
 */
export type IClassroomModify = Omit<IClassroom, 'teacherId'>;

/**
 * Remove classroom interface
 */
export type IClassroomRemove = Pick<IClassroom, 'id'>;
