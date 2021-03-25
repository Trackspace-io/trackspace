import { IStudent } from 'store/students/types';
import { ISubject } from 'store/subjects/types';

interface IProgressValues {
  homework: number;
  pageDone: number;
  pageFrom: number;
  pageSet: number;
  homeworkDone: number;
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
}

/**
 * Actions' type
 */
export enum PROGRESSES {
  SET_PROGRESSES = 'SET_PROGRESSES',
}

/**
 * Reducer's dispatchers interface
 */
export type IProgressesActions = { type: PROGRESSES.SET_PROGRESSES; payload: IProgress };

/**
 * Progress (of a student) by date interface
 */
export interface IProgressByDate {
  classroomId?: string;
  studentId?: string;
  date: string;
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
