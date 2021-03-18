import { _apiUrl } from 'api/api';
import axios from 'axios';
import { ITermCreate, ITermModify, ITermRemove } from 'store/terms/types';

/**
 * Get classrooms in which a student is enrolled.
 *
 * @method  GET
 * @url     /api/classrooms/:id/terms
 *
 * @returns {Promise<{
 *  id: string,
 *  start: Date,
 *  end: Date,
 *  days: string[],
 * }[]>} terms
 */
export const get = async (classroomId: string): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/classrooms/${classroomId}/terms`, { withCredentials: true });
};

/**
 * Creates a new term for the classroom.
 *
 * @method  POST
 * @url     /api/classrooms/:id/terms/add
 *
 * @param   {Date}      term.start        Start date of the term.
 * @param   {Date}      term.end          End date of the term.
 * @param   {string[]}  term.days         List of allowed days of the week in lower-case
 *                                        (e.g. sunday, monday, etc.).
 * @param   {string}    term.classroomID  End date of the term.
 *
 * @returns 200, 400, 500
 */
export const add = async (term: ITermCreate): Promise<any> => {
  const termAdd: Omit<ITermCreate, 'classroomId'> = {
    start: term.start,
    end: term.end,
    days: term.days,
  };

  return await axios.post(`${_apiUrl}/api/classrooms/${term.classroomId}/terms/add`, termAdd, {
    withCredentials: true,
  });
};

/**
 * Updates a term
 *
 * @method  PUT
 * @url     /api/classrooms/:id/terms/:id/modify
 *
 * @param   {string}    term.id           Id of the term.
 * @param   {Date}      term.start        Start date of the term.
 * @param   {Date}      term.end          End date of the term.
 * @param   {string[]}  term.days         List of allowed days of the week in lower-case
 *                                        (e.g. sunday, monday, etc.).
 * @param   {string}    term.classroomID  End date of the term.
 *
 * @returns 200, 400, 500
 */
export const update = async (term: ITermModify): Promise<any> => {
  const termUpdate: Omit<ITermModify, 'id' | 'classroomId'> = {
    start: term.start,
    end: term.end,
    days: term.days,
  };

  return await axios.put(`${_apiUrl}/api/classrooms/${term.classroomId}/terms/${term.id}/modify`, termUpdate, {
    withCredentials: true,
  });
};

/**
 * Deletes a term.
 *
 * @method  DELETE
 * @url     /api/classrooms/:id/terms/:id/remove
 *
 * @param   {string}    term.id           Id of the term.
 * @param   {string}    term.classroomID  End date of the term.
 *
 * @returns 200, 400, 500
 */
export const remove = async (term: ITermRemove): Promise<any> => {
  return await axios.delete(`${_apiUrl}/api/classrooms/${term.classroomId}/terms/${term.id}/remove`, {
    withCredentials: true,
  });
};
