import { ClassroomAPI, StudentsAPI } from 'api';
import { useMessages, useUsers } from 'controllers';
import * as React from 'react';
import { useGlobalStore } from 'store';
import studentsReducer from 'store/students';
import {
  IStudentAcceptInvitation,
  IStudentInvitationBySignIn,
  IStudentInvitationBySignUp,
  IStudentRemove,
} from 'store/students/types';

const { actions } = studentsReducer;

const useStudents = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Users = useUsers();
  const Messages = useMessages();

  // List of states
  const { students } = state;

  // List of actions
  const { setClassrooms, setStudents } = actions;

  // List of thunks

  /**
   * Get the classrooms list of the student.
   *
   * @param   none.
   *
   * @returns void
   */
  const getClassrooms = () => {
    StudentsAPI.getClassrooms()
      .then((response) => {
        const { data } = response;
        dispatch(setClassrooms(data));
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
   * Get the list of students enrolled in a classroom.
   *
   * @param   {string} id The id of the classroom.
   *
   * @returns void
   */
  const get = (classroomId: string) => {
    ClassroomAPI.getStudents(classroomId)
      .then((response) => {
        const { data } = response;

        dispatch(setStudents(data));
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
  const remove = (payload: IStudentRemove): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      ClassroomAPI.removeStudent(payload)
        .then((response) => {
          const { data } = response;

          get(classroomId);

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
   * Accept an invitation link to join to a classroom. Must be used if the student is already authenticated.
   *
   * @param   {string} payload.token The received token.
   *
   * @returns Promise
   */
  const acceptInvitation = (payload: IStudentAcceptInvitation): Promise<any> => {
    return new Promise((resolve) => {
      StudentsAPI.acceptInvitation(payload)
        .then((response) => {
          const { data } = response;

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
   * Sign-in and accept an invitation link to join to a classroom. Must be used if the student has an account.
   *
   * @param   {string} payload.username  The name of the user.
   * @param   {string} payload.password  The password of the user.
   * @param   {string} payload.token     The received token.
   *
   * @returns Promise
   */
  const acceptInvitationBySignIn = (payload: IStudentInvitationBySignIn): Promise<any> => {
    return new Promise((resolve) => {
      StudentsAPI.acceptInvitationBySignIn(payload)
        .then((response) => {
          const { data } = response;

          window.location.replace(data.redirect);

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
   * Sign-up and accept an invitation to join a classroom. Must be used if the student doesn't have an account yet.
   *
   * @param   {string} payload.email            The email of the user.
   * @param   {string} payload.firstName        The firstName of the user.
   * @param   {string} payload.lastName         The lastName of the user.
   * @param   {string} payload.password         The password of the user.
   * @param   {string} payload.confirmPassword  The password of the user.
   * @param   {string} payload.token            The received token.
   *
   * @returns Promise
   */
  const acceptInvitationBySignUp = (payload: IStudentInvitationBySignUp): Promise<any> => {
    return new Promise((resolve) => {
      StudentsAPI.acceptInvitationBySignUp(payload)
        .then((response) => {
          const { data } = response;

          window.location.replace('/');

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
    Users.current.role === 'student' && Users.isLogged && getClassrooms();
  }, [Users.current]);

  React.useEffect(() => {
    classroomId && get(classroomId);
  }, [classroomId]);

  return {
    ...students,
    remove,

    acceptInvitation,
    acceptInvitationBySignIn,
    acceptInvitationBySignUp,
  };
};

export default useStudents;
