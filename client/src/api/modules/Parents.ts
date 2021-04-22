import { _apiUrl } from 'api/api';
import axios from 'axios';
import {
  IParentAddChild,
  IParentConfirmRelationship,
  IParentGetChildren,
  IParentRemoveChild,
} from 'store/parents/types';
import {} from 'store/subjects/types';

/**
 * Get the list of children of a parent.
 *
 * @method  GET
 * @url     /api/users/parents/:id/children
 *
 * @param   {string} body.id  The identifier of the parent.
 *
 * @returns {Promise<IParent[]>} response.data.
 */
export const getChildren = async (body: IParentGetChildren): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/parents/${body.parentId}/children`, { withCredentials: true });
};

/**
 * Add a child to a parent.
 *
 * @method  GET
 * @url     /api/users/parents/:id/children/add
 *
 * @param   {string}  body.parentId The identifier of the parent.
 * @param   {string}  body.email    The email of the child.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const addChild = async (body: IParentAddChild): Promise<any> => {
  return await axios.post(`${_apiUrl}/api/users/parents/${body.parentId}/children/add`, body, {
    withCredentials: true,
  });
};

/**
 * Remove a child student.
 *
 * @method DELETE
 * @url    /users/parents/:id/children/:id/remove
 *
 * @param   {string}  body.parentId   The identifier of the parent.
 * @param   {string}  body.studentId  The identifier of the child.
 *
 * @returns 200, 400, 401, 404, 500
 */
export const removeChild = async (body: IParentRemoveChild): Promise<any> => {
  return await axios.delete(`${_apiUrl}/api/users/parents/${body.parentId}/children/${body.studentId}/remove`, {
    withCredentials: true,
  });
};

/**
 * Confirms the relation between a parent and a student.
 *
 * @method POST
 * @url    /users/parents/:id/children/:id/confirm
 *
 * @returns 200, 400, 401, 404, 500
 */
export const confirmRelationship = async (body: IParentConfirmRelationship): Promise<any> => {
  return (
    await axios.post(`${_apiUrl}/api/users/parents/${body.parentId}/children/${body.studentId}/confirm`),
    { withCredentials: true }
  );
};
