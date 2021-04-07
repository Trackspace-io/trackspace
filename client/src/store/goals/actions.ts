import { GOALS, IGoal } from './types';

export const setGoals = (payload: IGoal[]) => {
  return {
    type: GOALS.SET_GOALS,
    payload,
  };
};
