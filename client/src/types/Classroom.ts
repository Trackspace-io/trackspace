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

export interface IClassroomStudents {
  classroomId: string;
}

export interface IStudent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IClassroomRemoveStudent {
  classroomId: string;
  studentId: string;
}
