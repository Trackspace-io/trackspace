import { _apiUrl } from 'api/api';
import axios from 'axios';
import { IProgressByDate, IProgressSetOrUpdate } from 'store/progresses/types';

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
  return await axios.get(
    `${_apiUrl}/api/progress/classrooms/${body.classroomId}/students/${body.studentId}?date=${String(body.date)}`,
    { withCredentials: true },
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
