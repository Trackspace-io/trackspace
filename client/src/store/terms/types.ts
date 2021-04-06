/**
 * Term interface
 */
export interface ITerm {
  id: string;
  start: Date;
  end: Date;
  days: string[];
  classroomId: string;
  numberOfWeeks?: number;
}

/**
 * Reducer's state interface
 */
export interface ITermState {
  // Subjects list
  list: ITerm[];
  currentTerm: ITerm | null;
  selectedTerm: ITerm | null;
}

/**
 * Actions' type
 */
export enum TERMS {
  SET_TERMS = 'SET_TERMS',
  SET_CURRENT_TERM = 'SET_CURRENT_TERM',
  SET_SELECTED_TERM = 'SET_SELECTED_TERM',
}

/**
 * Reducer's dispatchers interface
 */
export type ITermActions =
  | { type: TERMS.SET_TERMS; payload: ITerm[] }
  | { type: TERMS.SET_CURRENT_TERM; payload: ITerm }
  | { type: TERMS.SET_SELECTED_TERM; payload: ITerm };

/**
 * Get term by id interface
 */
export type ITermGetById = Pick<ITerm, 'id' | 'classroomId'>;

/**
 * Get term by date interface
 */
export interface ITermGetByDate {
  classroomId: string;
  date: string;
}

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
