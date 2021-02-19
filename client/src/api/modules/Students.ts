import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IStudentInvitation, IStudentInvitationBySignIn, IStudentInvitationBySignUp } from 'types';

/**
 * Get classrooms in which a student is enrolled.
 *
 * @method  GET
 * @url     /api/users/students/classrooms
 *
 * @returns {Promise<{
 *  id: string,
 *  name: string,
 *  teacherId: string,
 * }[]>} response.data.
 */
export const getClassrooms = async (): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/students/classrooms`, { withCredentials: true });
};

/**
 * Accept an invitation. Must be used if the student is already authenticated.
 *
 * @method  POST
 * @url     /api/users/students/invitations/accept?t={token}
 *
 * @param   {string} body.token     The received token.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const acceptInvitation = async (body: IStudentInvitation): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/students/invitations/accept?t={${body.token}}`, {
    withCredentials: true,
  });
};

/**
 * Sign-in and accept an invitation. Must be used if the student has an account.
 *
 * @method  POST
 * @url     /api/users/students/invitations/accept/sign-in?t={token}
 *
 * @param   {string} body.username  The name of the user.
 * @param   {string} body.password  The password of the user.
 * @param   {string} body.token     The received token.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const acceptInvitationBySignIn = async (body: IStudentInvitationBySignIn): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/students/invitations/accept/sign-in?t={${body.token}}`, body, {
    withCredentials: true,
  });
};

/**
 * Sign-up and accept an invitation. Must be used if the student doesn't have an account yet.
 *
 * @method  POST
 * @url     /api/users/students/invitations/accept/sign-up?t={token}
 *
 * @param   {string} body.email     The email of the user.
 * @param   {string} body.firstName The firstName of the user.
 * @param   {string} body.lastName  The lastName of the user.
 * @param   {string} body.password  The password of the user.
 * @param   {string} body.token     The received token.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const acceptInvitationBySignUp = async (body: IStudentInvitationBySignUp): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/students/invitations/accept/sign-up?t={${body.token}}`, body, {
    withCredentials: true,
  });
};
