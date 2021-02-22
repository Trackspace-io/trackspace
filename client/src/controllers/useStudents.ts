import { StudentsAPI } from 'api';
import { StudentContext } from 'contexts';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { IClassroom, IStudentAcceptInvitation, IStudentInvitationBySignIn, IStudentInvitationBySignUp } from 'types';

import useMessages from './useMessages';
import useUser from './useUser';

interface IStudentsController {
  classroomsList: IClassroom[];

  acceptInvitation: (payload: IStudentAcceptInvitation) => Promise<any>;
  acceptInvitationBySignIn: (payload: IStudentInvitationBySignIn) => Promise<any>;
  acceptInvitationBySignUp: (payload: IStudentInvitationBySignUp) => Promise<any>;
}

const useStudents = (): IStudentsController => {
  const context = React.useContext(StudentContext.Ctx);

  const Messages = useMessages();
  const User = useUser();

  const history = useHistory();

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // States
  const { classroomsList } = context.state;

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
        console.log('students get classrooms', data);

        context.dispatch({ type: 'GET_CLASSROOMS', payload: data });
      })
      .catch((e) => {
        const { data } = e.response;
        console.log('students get classrooms error', data);

        Messages.add({
          type: 'error',
          text: `${data}`,
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
  const acceptInvitation = async (payload: IStudentAcceptInvitation): Promise<any> => {
    return new Promise((resolve) => {
      StudentsAPI.acceptInvitation(payload)
        .then((response) => {
          const { data } = response;
          console.log('acceptInvitation', data);

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;
          console.log('acceptInvitation error', data);

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
  const acceptInvitationBySignIn = async (payload: IStudentInvitationBySignIn): Promise<any> => {
    return new Promise((resolve) => {
      StudentsAPI.acceptInvitationBySignIn(payload)
        .then((response) => {
          const { data } = response;
          console.log('data', data);

          history.replace(data.redirect);

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;
          console.log('acceptInvitation error', data);

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
  const acceptInvitationBySignUp = async (payload: IStudentInvitationBySignUp): Promise<any> => {
    return new Promise((resolve) => {
      StudentsAPI.acceptInvitationBySignUp(payload)
        .then((response) => {
          const { data } = response;
          console.log('acceptInvitation', data);
          history.replace('/');

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;
          console.log('acceptInvitation error', data);

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

    // Dispatchers
    acceptInvitation,
    acceptInvitationBySignIn,
    acceptInvitationBySignUp,
  };
};

export default useStudents;
