import { ClassroomAPI, SubjectsAPI, TermsAPI } from 'api';
import { ClassroomContext } from 'contexts';
import * as React from 'react';
import {
  ITermCreate,
  IClassroom,
  IClassroomCreate,
  IClassroomRemove,
  IClassroomRemoveStudent,
  IClassroomUpdate,
  ITermRemove,
  IStudent,
  ISubject,
  ISubjectAdd,
  ISubjectEdit,
  ISubjectRemove,
  ITerm,
  ITermModify,
} from 'types';

import useMessages from './useMessages';
import useTeachers from './useTeachers';

interface IClassroomController {
  current: Partial<IClassroom>;
  studentsList: IStudent[];
  subjectsList: ISubject[];
  termsList: ITerm[];

  create: (payload: IClassroomCreate) => Promise<any>;
  update: (payload: IClassroomUpdate) => Promise<any>;
  remove: (payload: IClassroomRemove) => Promise<any>;

  removeStudent: (payload: IClassroomRemoveStudent) => Promise<any>;

  addSubject: (payload: ISubjectAdd) => Promise<any>;
  editSubject: (payload: ISubjectEdit) => Promise<any>;
  removeSubject: (payload: ISubjectRemove) => Promise<any>;

  createTerm: (payload: ITermCreate) => Promise<any>;
  modifyTerm: (payload: ITermModify) => Promise<any>;
  removeTerm: (payload: ITermRemove) => Promise<any>;
}

const useClassrooms = (classroomId?: string): IClassroomController => {
  // Get classroom context.
  const context = React.useContext(ClassroomContext.Ctx);

  // Get controllers
  const Messages = useMessages();
  const Teachers = useTeachers();

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // States
  const { current, studentsList, subjectsList, termsList } = context.state;

  React.useEffect(() => {
    classroomId && getCurrent(classroomId);
    classroomId && getStudents(classroomId);
    classroomId && getSubjects(classroomId);
    classroomId && getTerms(classroomId);
  }, []);

  /**
   * Get the classroom information
   *
   * @param   none.
   *
   * @returns void
   */
  const getCurrent = (classroomId: string) => {
    return new Promise((resolve) => {
      ClassroomAPI.getCurrent(classroomId)
        .then((response) => {
          const { data } = response;
          console.log('data', data);

          context.dispatch({ type: 'GET_CURRENT', payload: data });

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
  const getStudents = (classroomId: string) => {
    ClassroomAPI.getStudents(classroomId)
      .then((response) => {
        const { data } = response;

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

          getSubjects(classroomId);

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
  const getSubjects = (classroomId: string) => {
    ClassroomAPI.getSubjects(classroomId)
      .then((response) => {
        const { data } = response;

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

          getSubjects(classroomId);

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

          getSubjects(classroomId);

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

          getSubjects(classroomId);

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

  /**
   * Get the list of subjects of a classroom.
   *
   * @param   {string} id The id of the classroom.
   *
   * @returns void
   */
  const getTerms = async (classroomId: string) => {
    try {
      const terms = await TermsAPI.get(classroomId);
      console.log('terms', terms);

      if (terms) {
        context.dispatch({ type: 'GET_TERMS', payload: terms.data });
      }
    } catch (e) {
      const { msg } = e.response.data.errors[0];

      Messages.add({
        type: 'error',
        text: `${msg}`,
      });
    }
  };

  /**
   * Creates a new term for the classroom.
   *
   * @param   {Date}      term.start        Start date of the term.
   * @param   {Date}      term.end          End date of the term.
   * @param   {string[]}  term.days         List of allowed days of the week in lower-case
   *                                        (e.g. sunday, monday, etc.).
   * @param   {string}    term.classroomID  End date of the term.
   *
   * @returns Promise
   */
  const createTerm = (payload: ITermCreate): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      TermsAPI.add(payload)
        .then((response) => {
          const { data } = response;

          getTerms(classroomId);

          Messages.add({
            type: 'success',
            text: `Term added.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  /**
   * Updates a term
   *
   * @param   {string}    term.id           Id of the term.
   * @param   {Date}      term.start        Start date of the term.
   * @param   {Date}      term.end          End date of the term.
   * @param   {string[]}  term.days         List of allowed days of the week in lower-case
   *                                        (e.g. sunday, monday, etc.).
   * @param   {string}    term.classroomID  End date of the term.
   *
   * @returns Promise
   */
  const modifyTerm = (payload: ITermModify): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      TermsAPI.update(payload)
        .then((response) => {
          const { data } = response;

          getTerms(classroomId);

          Messages.add({
            type: 'success',
            text: `Term edited.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  /**
   * Deletes a term.
   *
   * @param   {string}    term.id           Id of the term.
   * @param   {string}    term.classroomID  End date of the term.
   *
   * @returns Promise
   */
  const removeTerm = (payload: ITermRemove): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      TermsAPI.remove(payload)
        .then((response) => {
          const { data } = response;

          getTerms(classroomId);

          Messages.add({
            type: 'success',
            text: `Term removed.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  return {
    // State
    current,
    studentsList,
    subjectsList,
    termsList,

    // Dispatchers
    create,
    update,
    remove,
    removeStudent,

    addSubject,
    editSubject,
    removeSubject,

    createTerm,
    modifyTerm,
    removeTerm,
  };
};

export default useClassrooms;
