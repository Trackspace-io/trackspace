import { MENU } from './types';
import moment from 'moment';

export const setDate = (payload: moment.Moment | null) => {
  return {
    type: MENU.SET_DATE,
    payload,
  };
};
