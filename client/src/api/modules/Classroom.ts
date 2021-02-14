import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IClassroomCreate, IClassroomRemove, IClassroomUpdate } from 'types';

/**
 * Get the list of classrooms.
 *
 * @method  GET
 * @url     /api/classrooms/get
 *
 * @returns {Promise<{
 *  id: string,
 *  name: string,
 *  teacherId: string,
 * }[]>} response.data.
 */
export const get = async (): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/classrooms/get`, { withCredentials: true });
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
