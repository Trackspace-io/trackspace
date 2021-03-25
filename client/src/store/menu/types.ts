import moment from 'moment';

/**
 * Reducer's state interface
 */
export interface IMenuState {
  /* List of messages */
  date: moment.Moment;
}

/**
 * Actions' type
 */
export enum MENU {
  SET_DATE = 'SET_DATE',
}

/**
 * Reducer's dispatchers interface
 */
export type IMenuActions = { type: MENU.SET_DATE; payload: moment.Moment };
