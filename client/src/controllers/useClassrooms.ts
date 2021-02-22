import { ClassroomAPI, SubjectsAPI } from 'api';
import { ClassroomContext } from 'contexts';
import * as React from 'react';
import {
  IClassroomCreate,
  IClassroomRemove,
  IClassroomRemoveStudent,
  IClassroomStudents,
  IClassroomUpdate,
  IStudent,
  ISubject,
  ISubjectAdd,
  ISubjectEdit,
  ISubjectGet,
  ISubjectRemove,
} from 'types';

import useMessages from './useMessages';
import useTeachers from './useTeachers';

interface IClassroomController {
  studentsList: IStudent[];
  subjectsList: ISubject[];

  create: (payload: IClassroomCreate) => Promise<any>;
  update: (payload: IClassroomUpdate) => Promise<any>;
  remove: (payload: IClassroomRemove) => Promise<any>;

  removeStudent: (payload: IClassroomRemoveStudent) => Promise<any>;

  addSubject: (payload: ISubjectAdd) => Promise<any>;
  editSubject: (payload: ISubjectEdit) => Promise<any>;
  removeSubject: (payload: ISubjectRemove) => Promise<any>;
}

// ??
const useClassrooms = (classroomId?: IClassroomStudents): IClassroomController => {
  const context = React.useContext(ClassroomContext.Ctx);

  // Notification
  const Messages = useMessages();
  const Teachers = useTeachers();

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // States
  const { studentsList, subjectsList } = context.state;

  React.useEffect(() => {
    classroomId && getStudents(<IClassroomStudents>classroomId);
    classroomId && getSubjects(<IClassroomStudents>classroomId);
  }, []);

  /**
   * Create a new classroom.
   *
   * @param {string} payload.name The name of the classroom.
   *
   * @returns void
   */
  const create = (payload: IClassroomCreate): Promise<any> => {
    return new Promise((resolve) => {
      ClassroomAPI.create(payload)
        .then((response) => {
          const { data } = response;

          Teachers.getClassrooms();

          Messages.add({
            type: 'success',
            text: `Classroom added.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  /**
   * Update the name of a classroom by its id.
   *
   * @param {string} payload.id   The id of the classroom.
   * @param {string} payload.name The name of the classroom.
   *
   * @returns void
   */
  const update = (payload: IClassroomUpdate): Promise<any> => {
    return new Promise((resolve) => {
      ClassroomAPI.update(payload)
        .then((response) => {
          const { data } = response;

          Teachers.getClassrooms();

          Messages.add({
            type: 'success',
            text: `Classroom's name updated.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  /**
   * Delete a classroom by its id
   *
   * @param {string} payload.id The id of the classroom.
   *
   * @returns void
   */
  const remove = (payload: IClassroomRemove): Promise<any> => {
    return new Promise((resolve) => {
      ClassroomAPI.remove(payload)
        .then((response) => {
          const { data } = response;

          Teachers.getClassrooms();

          Messages.add({
            type: 'success',
            text: `Classroom removed.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  /**
   * Get the list of students enrolled in a classroom.
   *
   * @param   {string} id The id of the classroom.
   *
   * @returns void
   */
  const getStudents = (payload: IClassroomStudents) => {
    ClassroomAPI.getStudents(payload)
      .then((response) => {
        const { data } = response;
        console.log('students', data);

        context.dispatch({ type: 'GET_STUDENTS', payload: data });
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Removes a student from this classroom.
   *
   * @param   {string} payload.classroomId  The id of the classroom.
   * @param   {string} payload.studentId    The id of the classroom.
   *
   * @returns void
   */
  const removeStudent = (payload: IClassroomRemoveStudent): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      ClassroomAPI.removeStudent(payload)
        .then((response) => {
          const { data } = response;

          getStudents({ classroomId });

          Messages.add({
            type: 'success',
            text: `Student removed.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  /**
   * Get the list of subjects of a classroom.
   *
   * @param   {string} id The id of the classroom.
   *
   * @returns void
   */
  const getSubjects = (payload: ISubjectGet) => {
    ClassroomAPI.getSubjects(payload)
      .then((response) => {
        const { data } = response;
        console.log('subject', data);

        context.dispatch({ type: 'GET_SUBJECTS', payload: data });
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Add a subject from a classroom.
   *
   * @param   {string} payload.classroomId  The id of the classroom.
   * @param   {string} payload.name         The name of the subject.
   *
   * @returns Promise
   */
  const addSubject = (payload: ISubjectAdd): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      SubjectsAPI.add(payload)
        .then((response) => {
          const { data } = response;

          getSubjects({ classroomId });

          Messages.add({
            type: 'success',
            text: `Subject added.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  /**
   * Remove a subject from a classroom.
   *
   * @param   {string} payload.classroomId  The id of the classroom.
   * @param   {string} payload.subjectId    The id of the subject.
   * @param   {string} payload.name      The name of the subject.
   *
   * @returns Promise
   */
  const editSubject = (payload: ISubjectEdit): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      SubjectsAPI.edit(payload)
        .then((response) => {
          const { data } = response;

          getSubjects({ classroomId });

          Messages.add({
            type: 'success',
            text: `Subject edited.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  /**
   * Remove a subject from a classroom.
   *
   * @param   {string} payload.classroomId  The id of the classroom.
   * @param   {string} payload.subject      The id of the subject.
   *
   * @returns Promise
   */
  const removeSubject = (payload: ISubjectRemove): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      SubjectsAPI.remove(payload)
        .then((response) => {
          const { data } = response;

          getSubjects({ classroomId });

          Messages.add({
            type: 'success',
            text: `Subject removed.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  return {
    // State
    studentsList,
    subjectsList,

    // Dispatchers
    create,
    update,
    remove,
    removeStudent,

    addSubject,
    editSubject,
    removeSubject,
  };
};

export default useClassrooms;
