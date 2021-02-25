import { TeachersAPI } from 'api';
import { TeacherContext } from 'contexts';
import * as React from 'react';
import { IClassroom, ITeacherGenerateLink } from 'types';

import useMessages from './useMessages';
import useUser from './useUser';

interface ITeachersController {
  classroomsList: IClassroom[];

  getClassrooms: () => void;
  generateLink: (payload: ITeacherGenerateLink) => Promise<any>;
}

const useTeachers = (): ITeachersController => {
  // Get teacher context.
  const context = React.useContext(TeacherContext.Ctx);

  // Use controllers
  const Messages = useMessages();
  const User = useUser();

  if (context === undefined) {
    throw new Error('Teacher context must be used within a Provider');
  }

  // States
  const { classroomsList } = context.state;

  // Fetch the list of classrooms if the teacher is authenticated
  React.useEffect(() => {
    User.isAuth && getClassrooms();
  }, [User.isAuth]);

  /**
   * Get the classrooms list of the teacher.
   *
   * @param   none.
   *
   * @returns void
   */
  const getClassrooms = () => {
    TeachersAPI.getClassrooms()
      .then((response) => {
        const { data } = response;

        context.dispatch({ type: 'GET', payload: data });
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
   * Generate an invitation link to add students to a classroom.
   *
   * @param   {number} payload.expiresIn  Number of seconds after which the link will
   *                                      expire. If empty, the link will never expire.
   *
   * @param   {string} payload.id         The classroom id.
   *
   * @returns Promise
   */
  const generateLink = async (payload: ITeacherGenerateLink): Promise<any> => {
    return new Promise((resolve) => {
      TeachersAPI.generateLink(payload)
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

  return {
    // State
    classroomsList,

    // Dispatchers
    getClassrooms,
    generateLink,
  };
};

export default useTeachers;
