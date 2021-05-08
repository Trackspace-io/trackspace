import { ProgressesAPI } from 'api';
import { useMessages } from 'controllers';
import { useGlobalStore } from 'store';
import progressesReducer from 'store/progresses';
import {
  IProgress,
  IProgressByDate,
  IProgressByWeek,
  IProgressGetGraph,
  IProgressSetOrUpdate,
} from 'store/progresses/types';

const { actions } = progressesReducer;

const useProgresses = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();

  // List of states
  const { progresses } = state;

  // List of actions
  const { setProgressByDate, setProgressByWeek, setProgressGraph } = actions;

  /**
   * Get the progress of a student by date.
   *
   * @param {string}  payload.classroomId
   * @param {string}  payload.studentId
   * @param {string}  payload.date
   */
  const getByDate = (payload: IProgressByDate) => {
    console.log('payload', payload);

    return new Promise((resolve) => {
      ProgressesAPI.getProgressByDate(payload)
        .then((response) => {
          const { data } = response;

          dispatch(setProgressByDate(data));
          resolve(data);
        })
        .catch(() => {
          dispatch(setProgressByDate(<IProgress>{}));
        });
    });
  };

  /**
   * Get the progress of a student by week.
   *
   * @param {string}  payload.studentId
   * @param {string}  payload.termId
   * @param {number}  payload.weekNumber
   */
  const getByWeek = (payload: IProgressByWeek) => {
    return new Promise((resolve, reject) => {
      ProgressesAPI.getProgressByWeek(payload)
        .then((response) => {
          const { data } = response;

          dispatch(setProgressByWeek(data));

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });

          reject(e);
        });
    });
  };

  /**
   * Get the weekly progress' graph values.
   *
   * @param {string}  payload.studentId
   * @param {string}  payload.termId
   * @param {number}  payload.weekNumber
   */
  const getProgressGraph = (payload: IProgressGetGraph) => {
    return new Promise((resolve, reject) => {
      ProgressesAPI.getProgressGraph(payload)
        .then((response) => {
          const { data } = response;

          dispatch(setProgressGraph(data));
          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });

          reject(e);
        });
    });
  };
  /**
   * Set or update a progress
   *
   * @param req.subjectId {string} Identifier of the subject.
   * @param req.studentId {string} Identifier of the student.
   * @param req.date      {date}   Date of the progress (yyyy-mm-dd).
   * @param req.pageFrom  {number} (Optional) Number of the starting page.
   * @param req.pageSet   {number} (Optional) Number of the page that the student
   *                               wants to reach.
   * @param req.pageDone  {number} (Optional) Number of the page reached by the
   *                               student at the end of the day.
   */
  const setOrUpdate = (payload: IProgressSetOrUpdate) => {
    const { studentId, date } = payload;

    return new Promise((resolve, reject) => {
      ProgressesAPI.setOrUpdateProgress(payload)
        .then(() => {
          getByDate({
            classroomId: String(classroomId),
            studentId,
            date,
          }).then((response) => {
            resolve(response);
          });
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });

          reject();
        });
    });
  };

  return {
    ...progresses,

    getByDate,
    getByWeek,
    getProgressGraph,
    setOrUpdate,
  };
};

export default useProgresses;
