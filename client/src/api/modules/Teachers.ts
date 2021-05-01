import { _apiUrl } from 'api/api';
import axios from 'axios';
import { ITeacherGenerateLink, ITeacherSendInvitation } from 'store/teachers/types';

/**
 * Get the list of classrooms taught by a teacher.
 *
 * @method  GET
 * @url     /api/users/teachers/classrooms
 *
 * @returns {Promise<{
 *  id: string,
 *  name: string,
 *  teacherId: string,
 * }[]>} response.data.
 */
export const getClassrooms = async (): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/teachers/classrooms`, { withCredentials: true });
};

/**
 * Generates an invitation link for a classroom.
 *
 * @method  POST
 * @url     /api/users/teachers/classrooms/:id/invitations/link?expiresIn={expiresIn}
 *
 *
 * @param   {number} body.expiresIn     Number of seconds after which the link will
 *                                      expire. If empty, the link will never expire.
 *
 * @param   {string} body.classroomId   The classroom id.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const generateLink = async (body: ITeacherGenerateLink): Promise<any> => {
  return await axios.get(
    `${_apiUrl}/api/users/teachers/classrooms/${body.classroomId}/invitations/link?expiresIn=${body.expiresIn}`,
    {
      withCredentials: true,
    },
  );
};

/**
 * Sends an invitation to a student.
 *
 * @method POST
 * @url    /api/users/teachers/classrooms/:id/invitations/send
 *
 * @param {string}  body.studentEmail Email address of the student to invite.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const sendInvitation = async (body: ITeacherSendInvitation): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/teachers/classrooms/${body.classroomId}/invitations/send`, body, {
    withCredentials: true,
  });
};
