/**
 * Goal interface
 */
export interface IGoal {
  nextWeeks: [];
  prevWeeks: [];
  pages: number;
  weekNumber: 1;
}

/**
 * Reducer's state interface
 */
export interface IGoalState {
  // List of goals
  list: IGoal[];
  graph: any;
}

/**
 * Actions' type
 */
export enum GOALS {
  SET_GOALS = 'SET_GOALS',
  SET_GOALS_GRAPH = 'SET_GOALS_GRAPH',
}

/**
 * Reducer's dispatchers interface
 */
export type IGoalActions = { type: GOALS.SET_GOALS; payload: IGoal[] } | { type: GOALS.SET_GOALS_GRAPH; payload: any };

export interface IGoalGet {
  classroomId: string;
  termId: string;
}

export interface IGoalRegister {
  classroomId: string;
  termId: string;
  weekNumber: number;
  pages: number;
}

export interface IGoalRemove {
  classroomId: string;
  termId: string;
  weekNumber: number;
}

export interface IGoalGetGraph {
  classroomId: string;
  termId: string;
  color?: string;
  width?: number;
}
