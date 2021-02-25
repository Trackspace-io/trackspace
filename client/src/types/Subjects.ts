export interface ISubject {
  id: string;
  name: string;
}

export interface ISubjectGet {
  classroomId: string;
}

export interface ISubjectAdd {
  classroomId: string;
  name: string;
}

export interface ISubjectEdit {
  classroomId: string;
  subjectId: string;
  name: string;
}

export interface ISubjectRemove {
  classroomId: string;
  subjectId: string;
}
