export interface IClassroom {
  id: string;
  name: string;
  teacherId: string;
}

export interface IClassroomCreate {
  name: string;
}

export interface IClassroomUpdate {
  id: string;
  name: string;
}

export interface IClassroomRemove {
  id: string;
}
