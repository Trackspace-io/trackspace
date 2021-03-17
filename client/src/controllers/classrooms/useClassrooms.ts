import { ClassroomAPI } from 'api';
import { useMessages, useTeachers } from 'controllers';
import useSubjects from 'controllers/subjects/useSubjects';
import useTerms from 'controllers/terms/useTerms';
import * as React from 'react';
import { useGlobalStore } from 'store';
import classroomsReducer from 'store/classrooms';
import { IClassroomCreate, IClassroomModify, IClassroomRemove } from 'store/classrooms/types';

const { actions } = classroomsReducer;

const useClassrooms = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();
  const Teachers = useTeachers();

  const Subjects = useSubjects(classroomId);
  const Terms = useTerms(classroomId);

  // List of states
  const { classrooms } = state;

  // List of actions
  const { setCurrent } = actions;

  /**
   * Get the classroom information
   *
   * @returns void
   */
  const getCurrent = (classroomId: string) => {
    return new Promise((resolve) => {
      ClassroomAPI.getCurrent(classroomId)
        .then((response) => {
          const { data } = response;

          dispatch(setCurrent(data));

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
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
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
  const modify = (payload: IClassroomModify): Promise<any> => {
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
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
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

  React.useEffect(() => {
    classroomId && getCurrent(classroomId);
  }, []);

  return {
    current: {
      ...classrooms.current,
      subjects: Subjects,
      terms: Terms,
    },

    create,
    modify,
    remove,
  };
};

export default useClassrooms;
