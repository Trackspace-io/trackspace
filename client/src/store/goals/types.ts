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
