import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IGoalGet, IGoalGetGraph, IGoalRegister, IGoalRemove } from 'store/goals/types';

/**
 * Sets a goal.
 *
 * @method POST
 * @url /classrooms/:id/terms/:id/goals/weeks/:number/set
 */
export const setGoal = async (body: IGoalRegister): Promise<any> => {
  return await axios.post(
    `${_apiUrl}/api/classrooms/${body.classroomId}/terms/${body.termId}/goals/weeks/${body.weekNumber}/set`,
    body,
    { withCredentials: true },
  );
};

/**
 * Unsets a goal.
 *
 * @method DELETE
 * @url    /classrooms/:id/terms/:id/goals/weeks/:number/remove
 */
export const unsetGoal = async (body: IGoalRemove): Promise<any> => {
  return await axios.delete(
    `${_apiUrl}/api/classrooms/${body.classroomId}/terms/${body.termId}/goals/weeks/${body.weekNumber}/unset`,
    { withCredentials: true },
  );
};

/**
 * Get the goals associated to a term.
 *
 * @method GET
 * @url    /classrooms/:id/terms/:id/goals
 */
export const getGoals = async (body: IGoalGet): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/classrooms/${body.classroomId}/terms/${body.termId}/goals`, {
    withCredentials: true,
  });
};

/**
 * Gets the goal graph of a term.
 *
 * @method GET
 * @url    /classrooms/:id/terms/:id/goals/graph
 */
export const getGraph = async (body: IGoalGetGraph): Promise<any> => {
  return await axios.get(
    `${_apiUrl}/api/classrooms/${body.classroomId}/terms/${body.termId}/graph?color=${body.color}&width=${body.color}`,
    { withCredentials: true },
  );
};
