import { _apiUrl } from 'api/api';
import axios from 'axios';

import { IStudentAcceptInvitation, IStudentInvitationBySignIn, IStudentInvitationBySignUp } from 'store/students/types';

import { IInvitationGet } from 'store/invitations/types';

/**
 * Get classrooms in which a student is enrolled.
 *
 * @method  GET
 * @url     /api/users/students/:id/classrooms
 *
 * @returns {Promise<{
 *  id: string,
 *  name: string,
 *  teacherId: string,
 * }[]>} response.data.
 */
export const getClassrooms = async (studentId: string): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/students/${studentId}/classrooms`, { withCredentials: true });
};

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
export const getInvitationInfo = async (body: IInvitationGet): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/students/invitations/info?t=${body.token}`, { withCredentials: true });
};

/**
 * Accept an invitation link to join to a classroom. Must be used if the student is already authenticated.
 *
 * @method  POST
 * @url     /api/users/students/invitations/accept?t={token}
 *
 * @param   {string} body.token     The received token.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const acceptInvitation = async (body: IStudentAcceptInvitation): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/students/invitations/accept?t=${body.token}`, {
    withCredentials: true,
  });
};

/**
 * Sign-in and accept an invitation link to join to a classroom. Must be used if the student has an account.
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
  return await axios.post(`${_apiUrl}/api/users/students/invitations/accept/sign-in?t=${body.token}`, body, {
    withCredentials: true,
  });
};

/**
 * Sign-up and accept an invitation to join a classroom. Must be used if the student doesn't have an account yet.
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
  return await axios.post(`${_apiUrl}/api/users/students/invitations/accept/sign-up?t=${body.token}`, body, {
    withCredentials: true,
  });
};
