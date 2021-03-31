import { IProgress, IProgressByWeekValues, PROGRESSES } from './types';

export const setProgressByDate = (payload: IProgress) => {
  return {
    type: PROGRESSES.SET_PROGRESSES_BY_DATE,
    payload,
  };
};

export const setProgressByWeek = (payload: IProgressByWeekValues) => {
  return {
    type: PROGRESSES.SET_PROGRESSES_BY_WEEK,
    payload,
  };
};
