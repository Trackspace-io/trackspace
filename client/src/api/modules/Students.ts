import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IInvitationGet } from 'store/invitations/types';
import {
  IStudentAcceptInvitation,
  IStudentAddParent,
  IStudentConfirmRelationship,
  IStudentGetParents,
  IStudentInvitationBySignIn,
  IStudentInvitationBySignUp,
  IStudentRemoveParent,
} from 'store/students/types';

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

/**
 * Get the list of parents of a student.
 *
 * @method  GET
 * @url     /users/students/:id/parents
 *
 * @param   {string} body.studentId The identifier of the student.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const getParents = async (body: IStudentGetParents): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/students/${body.studentId}/parents`, {
    withCredentials: true,
  });
};

/**
 * Confirms the relation between a student and a parent.
 *
 * @method POST
 * @url    /users/students/:id/parents/:id/confirm
 *
 * @param   {string}  body.studentId  The identifier of the child.
 * @param   {string}  body.parentId   The identifier of the parent.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const confirmRelationship = async (body: IStudentConfirmRelationship): Promise<any> => {
  console.log('studentId', body.studentId);
  console.log('parentId', body.parentId);

  return await axios.post(`${_apiUrl}/api/users/students/${body.studentId}/parents/${body.parentId}/confirm`, body, {
    withCredentials: true,
  });
};

/**
 * Add a parent to the student.
 *
 * @method  POST
 * @url     /users/students/:id/parent/add
 *
 * @param   {string}  body.studentId  The identifier of the child.
 * @param   {string}  req.email       The parent's email address.
 *
 *
 * @returns 200, 500
 */
export const addParent = async (body: IStudentAddParent): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/students/${body.studentId}/parents/add`, body, {
    withCredentials: true,
  });
};

/**
 * Remove a parent.
 *
 * @method DELETE
 * @url    /users/students/:id/parents/:id/remove
 *
 * @param   {string}  body.studentId  The identifier of the child.
 * @param   {string}  body.parentId   The identifier of the parent.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const removeParent = async (body: IStudentRemoveParent): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/students/${body.studentId}/parents/${body.parentId}/remove`, body, {
    withCredentials: true,
  });
};
