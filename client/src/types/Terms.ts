export interface ITerm {
  id: string;
  start: Date;
  end: Date;
  days: string[];
  classroomId: string;
}

export type ITermCreate = Omit<ITerm, 'id'>;

export type ITermRemove = Pick<ITerm, 'id' | 'classroomId'>;

export type ITermModify = ITerm;
