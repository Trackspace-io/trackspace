import { ClassroomAPI, SubjectsAPI } from 'api';
import { useMessages } from 'controllers';
import * as React from 'react';
import { useGlobalStore } from 'store';
import subjectsReducer from 'store/subjects';
import { ISubjectAdd, ISubjectModify, ISubjectRemove } from 'store/subjects/types';

const { actions } = subjectsReducer;

const useSubjects = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  const Messages = useMessages();

  // List of states
  const { subjects } = state;

  // List of actions
  const { setSubjects } = actions;

  // List of thunks

  /**
   * Get the list of subjects
   *
   * @returns void
   */
  const get = (classroomId: string) => {
    ClassroomAPI.getSubjects(classroomId)
      .then((response) => {
        const { data } = response;

        dispatch(setSubjects(data));
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
  const add = (payload: ISubjectAdd): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      SubjectsAPI.add(payload)
        .then((response) => {
          const { data } = response;

          get(classroomId);

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
  const modify = (payload: ISubjectModify): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      SubjectsAPI.edit(payload)
        .then((response) => {
          const { data } = response;

          get(classroomId);

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
  const remove = (payload: ISubjectRemove): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      SubjectsAPI.remove(payload)
        .then((response) => {
          const { data } = response;

          get(classroomId);

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

  React.useEffect(() => {
    classroomId && get(classroomId);
  }, [classroomId]);

  return {
    ...subjects,

    get,
    add,
    modify,
    remove,
  };
};

export default useSubjects;
