import { GOALS, IGoal } from './types';

export const setGoals = (payload: IGoal[]) => {
  return {
    type: GOALS.SET_GOALS,
    payload,
  };
};

export const setGoalsGraph = (payload: any) => {
  return {
    type: GOALS.SET_GOALS_GRAPH,
    payload,
  };
};
