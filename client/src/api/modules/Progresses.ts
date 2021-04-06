import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IProgressByDate, IProgressByWeek, IProgressGetGraph, IProgressSetOrUpdate } from 'store/progresses/types';

/**
 * Get the progress of a student by date.
 *
 * @method GET
 * @url    api/progress/classrooms/:id/students/:id?date={date}
 *
 * @param {string}  body.classroomId  The identifier of the classroom.
 * @param {string}  body.studentId    The identifier of the student.
 * @param {string}  body.date         The date of the progress
 *
 * @returns 200, 400, 401, 500
 *
 */
export const getProgressByDate = async (body: IProgressByDate) => {
  console.log('body', body);

  return await axios.get(
    `${_apiUrl}/api/progress/classrooms/${body.classroomId}/students/${body.studentId}?date=${body.date}`,
    { withCredentials: true },
  );
};

/**
 * Get the progress values.
 *
 * @method GET
 * @url    /progress/student/:id/terms/:id/weeks/:number
 *
 * @param params.studentId  The student identifier.
 * @param params.termId     Identifier of the term.
 * @param params.weekNumber Number of the week (1-n).
 *
 * @returns 200, 400, 401, 500
 */
export const getProgressByWeek = async (body: IProgressByWeek) => {
  return await axios.get(
    `${_apiUrl}/api/progress/terms/${body.termId}/student/${body.studentId}/weeks/${body.weekNumber}`,
    { withCredentials: true },
  );
};

/**
 * Gets the progress graph of a student.
 *
 * @method POST
 * @url    /progress/terms/:id/students/:id/graph
 *
 * @param query.color Color of the line (Hex code).
 * @param query.width Width of the line (Pixels).
 *
 * @returns 200, 400, 401, 500
 */

export const getProgressGraph = async (body: IProgressGetGraph) => {
  const color = `${'9ab986'}`;
  const width = '4';

  return await axios.get(
    `${_apiUrl}/api/progress/terms/${body.termId}/students/${body.studentId}/graph?color=${color}&width=${width}`,
    {
      withCredentials: true,
    },
  );
};

/**
 * Registers a progress.
 *
 * @method POST
 * @url    api/progress
 *
 * @param {string}  body.subjectId  The identifier of the classroom.
 * @param {string}  body.studentId  The identifier of the student.
 * @param {string}  body.date       The date of the progress
 * @param {number}  body.pageFrom   (Optional) Number of the starting page
 * @param {number}  body.pageSet    (Optional) Number of the page that the student
 *                                    wants to reach.
 * @param {number}  body.pageDone   (Optional) Number of the page reached by the
 *                                    student at the end of the day.
 *
 * @returns 200, 400, 401, 500
 *
 */
export const setOrUpdateProgress = async (body: IProgressSetOrUpdate) => {
  return await axios.post(`${_apiUrl}/api/progress`, body, { withCredentials: true });
};
