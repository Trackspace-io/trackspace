import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IClassroomCreate, IClassroomRemove, IClassroomRemoveStudent, IClassroomUpdate } from 'types';

/**
 * Get a classroom information
 *
 * @method  GET
 * @url     /api/classrooms/:id
 *
 * @returns {Promise<{
 *  name: string,
 * }[]>} response.data.
 */
export const getCurrent = async (classroomId: string): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/classrooms/${classroomId}`, { withCredentials: true });
};

/**
 * Create a classroom.
 *
 * @method  POST
 * @url     /api/classrooms/create
 *
 * @param   {string} body.name  The name of the classroom.
 *
 * @returns 200, 400, 500
 */
export const create = async (body: IClassroomCreate): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/classrooms/create`, body, { withCredentials: true });
};

/**
 * Update a classroom's name.
 *
 * @method  PUT
 * @url     /api/classrooms/:id/modify
 *
 * @param   {string} body.id    The classroom's id.
 * @param   {string} body.name  The new name of the classroom.
 *
 * @returns 200, 400, 500
 */
export const update = async (body: IClassroomUpdate): Promise<any> => {
  return await axios.put(`${_apiUrl}/api/classrooms/${body.id}/modify`, body, { withCredentials: true });
};

/**
 * Delete a classroom.
 *
 * @method  DELETE
 * @url     /classrooms/:id/delete
 *
 * @param   {string} body.id  The classroom's id
 *
 * @returns 200, 400, 500
 */
export const remove = async (body: IClassroomRemove): Promise<any> => {
  return await axios.delete(`${_apiUrl}/api/classrooms/${body.id}/delete`, { withCredentials: true });
};

/**
 * Get the list of students enrolled in a classroom.
 *
 * @method  GET
 * @url     /api/classrooms/:id/students
 *
 * @param   {string} body.classroomId  The id of the classroom.
 *
 * @returns {Promise<{
 *  id: string,
 *  name: string,
 *  firstName: string,
 *  lastName: string,
 * }[]>} response.data.
 */
export const getStudents = async (classroomId: string): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/classrooms/${classroomId}/students`, { withCredentials: true });
};

/**
 * Removes a student from this classroom.
 *
 * @method  DELETE
 * @url     /classrooms/:id/students/:id/remove
 *
 * @param   {string} body.classroomId The id of the classroom.
 * @param   {string} body.studentId   The id of the student to be removed.
 *
 * @returns 200, 400, 500
 */
export const removeStudent = async (body: IClassroomRemoveStudent): Promise<any> => {
  return await axios.delete(`${_apiUrl}/api/classrooms/${body.classroomId}/students/${body.studentId}/remove`, {
    withCredentials: true,
  });
};

/**
 * Get the list of subjects associated to a classroom.
 *
 * @method  GET
 * @url     /api/classrooms/:id/subjects
 *
 * @param   {string} body.classroomId  The id of the classroom.
 *
 * @returns {Promise<{
 *  id: string,
 *  name: string,
 * }[]>} response.data.
 */
export const getSubjects = async (classroomId: string): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/classrooms/${classroomId}/subjects`, { withCredentials: true });
};
