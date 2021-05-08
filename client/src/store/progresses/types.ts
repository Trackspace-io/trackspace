import { IStudent } from 'store/students/types';
import { ISubject } from 'store/subjects/types';

export interface IProgressValues {
  homework: number;
  pageDone: number;
  pageFrom: number;
  pageSet: number;
  homeworkDone: boolean;
}

export interface IProgressByWeekValues {
  dates: string[];
  days: string[];
  progress: {
    subject: ISubject;
    values: {
      day: string;
      homework: number;
      homeworkDone: boolean;
      pageDone: number;
      pageFrom: number;
      pageSet: number;
      progressKey: {
        date: Date;
        studentId: Pick<IStudent, 'id'>;
        subjectId: Pick<ISubject, 'id'>;
      };
    }[];
  }[];
}

/**
 * Progress state interface
 */
export interface IProgress {
  subjects: IProgressSubject[];
  termNumber: number;
  weekNumber: number;
}

export interface IProgressSubject {
  progressKey: {
    date: string;
    studentId: string;
    subjectId: string;
  };
  subject: ISubject;
  values: IProgressValues;
}

/**
 * Reducer's state interface
 */
export interface IProgressState {
  // List of progress of a student
  byDate: Partial<IProgress>;
  byWeek: Partial<IProgressByWeekValues>;
  graph: any;
}

/**
 * Actions' type
 */
export enum PROGRESSES {
  SET_PROGRESSES_BY_DATE = 'SET_PROGRESSES_BY_DATE',
  SET_PROGRESSES_BY_WEEK = 'SET_PROGRESSES_BY_WEEK',
  SET_PROGRESSES_GRAPH = 'SET_PROGRESSES_GRAPH',
}

/**
 * Reducer's dispatchers interface
 */
export type IProgressesActions =
  | { type: PROGRESSES.SET_PROGRESSES_BY_DATE; payload: IProgress }
  | { type: PROGRESSES.SET_PROGRESSES_BY_WEEK; payload: IProgressByWeekValues }
  | { type: PROGRESSES.SET_PROGRESSES_GRAPH; payload: any };

/**
 * Progress (of a student) by date interface
 */
export interface IProgressByDate {
  classroomId: string;
  studentId: string;
  date: string;
}

/**
 * Weekly progress interface
 */
export interface IProgressByWeek {
  studentId: string;
  termId: string;
  weekNumber: number;
}

/**
 * Register or update a progress interface
 */
export interface IProgressSetOrUpdate {
  subjectId: string;
  studentId: string;
  date: string;
  pageFrom?: number;
  pageSet?: number;
  pageDone?: number;
  homeworkDone?: boolean;
}

/**
 * Get progress graph interface
 */
export interface IProgressGetGraph {
  termId: string;
  studentId: string;
}
