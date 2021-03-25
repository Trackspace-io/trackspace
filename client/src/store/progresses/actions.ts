import { IProgressByDate, PROGRESSES } from './types';

export const setProgressByDate = (payload: IProgressByDate) => {
  return {
    type: PROGRESSES.SET_PROGRESSES,
    payload,
  };
};
