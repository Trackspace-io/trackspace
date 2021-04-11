import { GoalsAPI } from 'api';
import { useMessages } from 'controllers';
import { useGlobalStore } from 'store';
import goalsReducer from 'store/goals';
import { IGoalGet, IGoalGetGraph, IGoalRegister, IGoalRemove } from 'store/goals/types';

const { actions } = goalsReducer;

const useGoals = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  const Messages = useMessages();

  // List of states.
  const { goals } = state;

  // List of actions.
  const { setGoals, setGoalsGraph } = actions;

  // List of thunks.

  /**
   * Get the list of goals
   *
   * @param   {string} payload.classroomId  The identifier of the classroom.
   * @param   {string} payload.termId       The identifier of the term.
   *
   * @returns Promise
   */
  const get = (payload: IGoalGet) => {
    GoalsAPI.getGoals(payload)
      .then((response) => {
        const { data } = response;

        dispatch(setGoals(data));
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Get the goal's graph.
   *
   * @param   {string} payload.classroomId  The identifier of the classroom.
   * @param   {string} payload.termId       The identifier of the term.
   * @param   {hex}    payload.color        The color of the graph in hex format.
   * @param   {number} payload.width        The width of the graph.
   *
   * @returns Promise
   */
  const getGraph = (payload: IGoalGetGraph) => {
    GoalsAPI.getGraph(payload)
      .then((response) => {
        const { data } = response;

        dispatch(setGoalsGraph(data));
      })
      .catch((e) => {
        const { data } = e.response;

        Messages.add({
          type: 'error',
          text: `${data}`,
        });
      });
  };

  /**
   * Add a goal for a specific week.
   *
   * @param   {string} payload.classroomId  The identifier of the classroom.
   * @param   {string} payload.termId       The identifier of the term.
   * @param   {number} payload.pages        The number of pages set.
   * @param   {number} payload.weekNumber   The week number of the term.
   *
   * @returns Promise
   */
  const set = (payload: IGoalRegister) => {
    const { classroomId, termId } = payload;

    return new Promise((resolve) => {
      GoalsAPI.setGoal(payload)
        .then((response) => {
          const { data } = response;

          get({ classroomId, termId });

          Messages.add({
            type: 'success',
            text: `Goal set.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  /**
   * Remove a goal for a specific week.
   *
   * @param   {string} payload.classroomId  The identifier of the classroom.
   * @param   {string} payload.termId       The identifier of the term.
   * @param   {number} payload.weekNumber   The week number of the term.
   *
   * @returns Promise
   */
  const unset = (payload: IGoalRemove) => {
    const { classroomId, termId } = payload;

    return new Promise((resolve) => {
      GoalsAPI.unsetGoal(payload)
        .then((response) => {
          const { data } = response;

          get({ classroomId, termId });

          Messages.add({
            type: 'success',
            text: `Goal unset.`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });
        });
    });
  };

  return {
    ...goals,

    get,
    set,
    unset,
    getGraph,
  };
};

export default useGoals;
