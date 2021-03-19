/**
 * Term interface
 */
export interface ITerm {
  id: string;
  start: Date;
  end: Date;
  days: string[];
  classroomId: string;
}

/**
 * Reducer's state interface
 */
export interface ITermState {
  // Subjects list
  list: ITerm[];
}

/**
 * Actions' type
 */
export enum TERMS {
  SET_TERMS = 'SET_TERMS',
}

/**
 * Reducer's dispatchers interface
 */
export type ITermActions = { type: TERMS.SET_TERMS; payload: ITerm[] };

/**
 * Create term interface
 */
export type ITermCreate = Omit<ITerm, 'id'>;

/**
 * Modify term interface
 */
export type ITermModify = ITerm;

/**
 * Remove term interface
 */
export type ITermRemove = Pick<ITerm, 'id' | 'classroomId'>;
