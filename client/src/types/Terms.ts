export interface ITerm {
  id: string;
  start: Date;
  end: Date;
  days: string[];
  classroomId: string;
}

export type IAddTerm = Omit<ITerm, 'id'>;
