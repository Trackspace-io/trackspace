import { StudentsAPI } from 'api';
import { StudentContext } from 'contexts';
import * as React from 'react';
import {
  IClassroom,
  IStudentAcceptInvitation,
  IStudentInvitation,
  IStudentInvitationBySignIn,
  IStudentInvitationBySignUp,
  IStudentInvitationInfo,
} from 'types';

import useMessages from './useMessages';
import useUser from './useUser';

interface IStudentsController {
  classroomsList: IClassroom[];
  invitationInfo: IStudentInvitationInfo;

  getInvitationInfo: (payload: IStudentInvitation) => Promise<any>;
  acceptInvitation: (payload: IStudentAcceptInvitation) => Promise<any>;
  acceptInvitationBySignIn: (payload: IStudentInvitationBySignIn) => Promise<any>;
  acceptInvitationBySignUp: (payload: IStudentInvitationBySignUp) => Promise<any>;
}

const useStudents = (): IStudentsController => {
  // User context.
  const context = React.useContext(StudentContext.Ctx);

  // Use controllers
  const Messages = useMessages();
  const User = useUser();

  if (context === undefined) {
    throw new Error('Student context must be used within a Provider');
  }

  // States
  const { classroomsList, invitationInfo } = context.state;

  // Fetch the list of classrooms if the student is authenticated
  React.useEffect(() => {
    User.isAuth && getClassrooms();
  }, [User.isAuth]);

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

        context.dispatch({ type: 'GET_CLASSROOMS', payload: data });
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
   * Get the invitation's information
   *
   * @param   {string} token  The invitation token
   *
   * @returns Promise
   */
  const getInvitationInfo = (payload: IStudentInvitation) => {
    return new Promise((resolve) => {
      StudentsAPI.getInvitationInfo(payload)
        .then((response) => {
          const { data } = response;
          console.log('data', data);

          context.dispatch({ type: 'GET_INVITATION_INFO', payload: data });

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

  return {
    // States
    classroomsList,
    invitationInfo,

    // Dispatchers
    getInvitationInfo,
    acceptInvitation,
    acceptInvitationBySignIn,
    acceptInvitationBySignUp,
  };
};

export default useStudents;
