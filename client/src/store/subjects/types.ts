/**
 * Subject interface
 */
export interface ISubject {
  id: string;
  name: string;
}

export interface ISubjectState {
  // Subjects list
  list: ISubject[];
}

/**
 * Actions' type
 */
export enum SUBJECTS {
  SET_SUBJECTS = 'SET_SUBJECTS',
}

/**
 * Reducer's dispatchers interface
 */
export type ISubjectActions = { type: SUBJECTS.SET_SUBJECTS; payload: ISubject[] };

/**
 * Add Subject interface
 */
export interface ISubjectAdd {
  classroomId: string;
  name: string;
}

/**
 * Modify subject interface
 */
export interface ISubjectModify {
  classroomId: string;
  subjectId: string;
  name: string;
}

/**
 * Remove subject interface
 */
export interface ISubjectRemove {
  classroomId: string;
  subjectId: string;
}
