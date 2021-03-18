import { _apiUrl } from 'api/api';
import axios from 'axios';
import { ISubjectAdd, ISubjectModify, ISubjectRemove } from 'store/subjects/types';

/**
 * Adds a subject to a classroom.
 *
 * @method  POST
 * @url     /api/classrooms/:id/subjects/add
 *
 * @param   {string} body.classroomId   The id of the classroom.
 * @param   {string} body.name          The name of the subject.
 *
 * @returns 200, 400, 500
 */
export const add = async (body: ISubjectAdd): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/classrooms/${body.classroomId}/subjects/add`, body, {
    withCredentials: true,
  });
};

/**
 * Edits a subject.
 *
 * @method  PUT
 * @url     /api/classrooms/:id/subjects/:id/edit
 *
 * @param   {string} body.classroomId The classroom's id.
 * @param   {string} body.subjectId   The classroom's id.
 * @param   {string} body.name        The new name of the classroom.
 *
 * @returns 200, 400, 500
 */
export const edit = async (body: ISubjectModify): Promise<any> => {
  return await axios.put(`${_apiUrl}/api/classrooms/${body.classroomId}/subjects/${body.subjectId}/edit`, body, {
    withCredentials: true,
  });
};

/**
 * Remove a subject from a classroom.
 *
 * @method  DELETE
 * @url     /classrooms/:id/subjects/:id/remove
 *
 * @param   {string} body.classroomId   The classroom's id.
 * @param   {string} body.subjectId     The subject's id.
 *
 * @returns 200, 400, 500
 */
export const remove = async (body: ISubjectRemove): Promise<any> => {
  return await axios.delete(`${_apiUrl}/api/classrooms/${body.classroomId}/subjects/${body.subjectId}/remove`, {
    withCredentials: true,
  });
};
