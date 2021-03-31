import { IStudent } from 'store/students/types';
import { ISubject } from 'store/subjects/types';

interface IProgressValues {
  homework: number;
  pageDone: number;
  pageFrom: number;
  pageSet: number;
  homeworkDone: number;
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
  subjects: {
    progressKey: {
      date: Date;
      studentId: Pick<IStudent, 'id'>;
      subjectId: Pick<ISubject, 'id'>;
    };
    subject: ISubject;
    values: IProgressValues;
  }[];
  termNumber: number;
  weekNumber: number;
}

/**
 * Reducer's state interface
 */
export interface IProgressState {
  // List of progress of a student
  byDate: Partial<IProgress>;
  byWeek: Partial<IProgressByWeekValues>;
}

/**
 * Actions' type
 */
export enum PROGRESSES {
  SET_PROGRESSES_BY_DATE = 'SET_PROGRESSES_BY_DATE',
  SET_PROGRESSES_BY_WEEK = 'SET_PROGRESSES_BY_WEEK',
}

/**
 * Reducer's dispatchers interface
 */
export type IProgressesActions =
  | { type: PROGRESSES.SET_PROGRESSES_BY_DATE; payload: IProgress }
  | { type: PROGRESSES.SET_PROGRESSES_BY_WEEK; payload: IProgressByWeekValues };

/**
 * Progress (of a student) by date interface
 */
export interface IProgressByDate {
  classroomId?: string;
  studentId?: string;
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
}
