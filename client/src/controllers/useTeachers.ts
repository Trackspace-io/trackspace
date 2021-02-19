import { TeachersAPI } from 'api';
import { ITeacherGenerateLink } from 'types';
import useMessages from './useMessages';

interface ITeachersController {
  generateLink: (payload: ITeacherGenerateLink) => Promise<any>;
}

const useTeachers = (): ITeachersController => {
  const Messages = useMessages();

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
    generateLink,
  };
};

export default useTeachers;
