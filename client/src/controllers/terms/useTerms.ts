import { TermsAPI } from 'api';
import { useMessages } from 'controllers';
import moment from 'moment';
import * as React from 'react';
import { useGlobalStore } from 'store';
import termsReducer from 'store/terms';
import { ITerm, ITermCreate, ITermGetByDate, ITermGetById, ITermModify, ITermRemove } from 'store/terms/types';

const { actions } = termsReducer;

const useTerms = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  const Messages = useMessages();

  // List of states
  const { terms } = state;

  // List of actions
  const { setTerms, setCurrentTerm } = actions;

  // List of thunks

  /**
   * Get the list of terms of a classroom.
   *
   * @param   {string} classroomId  The id of the classroom.
   *
   * @returns void
   */
  const get = async (classroomId: string) => {
    try {
      const terms = await TermsAPI.get(classroomId);

      if (terms) {
        dispatch(setTerms(terms.data));
      }
    } catch (e) {
      const { data } = e.response;

      Messages.add({
        type: 'error',
        text: `${data}`,
      });
    }
  };

  /**
   * Get the term by its id.
   *
   * @param {String} payload.id           The identifier of the term.
   * @param {String} payload.classroomId  The identifier of the term.
   *
   * @returns Promise
   */
  const getById = (payload: ITermGetById): Promise<any> => {
    return new Promise((resolve) => {
      TermsAPI.getById(payload)
        .then((response) => {
          const { data } = response;

          dispatch(setCurrentTerm(data));
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
   * Get the term by its id.
   *
   * @param {String}  payload.classroomId The identifier of the classroom.
   * @param {Date}    payload.date        The identifier of the term.
   *
   * @returns Promise
   */
  const getByDate = (payload: ITermGetByDate): Promise<any> => {
    return new Promise((resolve) => {
      TermsAPI.getByDate(payload)
        .then((response) => {
          const { data } = response;

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
   * Creates a new term for the classroom.
   *
   * @param   {Date}      payload.start        Start date of the term.
   * @param   {Date}      payload.end          End date of the term.
   * @param   {string[]}  payload.days         List of allowed days of the week in lower-case
   *                                        (e.g. sunday, monday, etc.).
   * @param   {string}    payload.classroomID  End date of the term.
   *
   * @returns Promise
   */
  const create = (payload: ITermCreate): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      TermsAPI.add(payload)
        .then((response) => {
          const { data } = response;

          get(classroomId);

          Messages.add({
            type: 'success',
            text: `Term added.`,
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
   * Updates a term
   *
   * @param   {string}    term.id           Id of the term.
   * @param   {Date}      term.start        Start date of the term.
   * @param   {Date}      term.end          End date of the term.
   * @param   {string[]}  term.days         List of allowed days of the week in lower-case
   *                                        (e.g. sunday, monday, etc.).
   * @param   {string}    term.classroomID  End date of the term.
   *
   * @returns Promise
   */
  const modify = (term: ITermModify): Promise<any> => {
    const { classroomId } = term;

    return new Promise((resolve) => {
      TermsAPI.update(term)
        .then((response) => {
          const { data } = response;

          get(classroomId);

          Messages.add({
            type: 'success',
            text: `Term edited.`,
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
   * Deletes a term.
   *
   * @param   {string}    term.id           Id of the term.
   * @param   {string}    term.classroomID  End date of the term.
   *
   * @returns Promise
   */
  const remove = (term: ITermRemove): Promise<any> => {
    const { classroomId } = term;

    return new Promise((resolve) => {
      TermsAPI.remove(term)
        .then((response) => {
          const { data } = response;

          get(classroomId);

          Messages.add({
            type: 'success',
            text: `Term removed.`,
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
   * Get current term
   *
   * @return void
   */
  const getCurrentTerm = () => {
    const today = moment().add(1, 'days').format('YYYY-MM-DD');

    getByDate({
      classroomId: String(classroomId),
      date: today,
    }).then((data) => {
      dispatch(setCurrentTerm(data));
    });
  };

  const setSelectedTerm = (payload: ITerm) => {
    dispatch(actions.setSelectedTerm(payload));
  };

  React.useEffect(() => {
    classroomId && get(classroomId);
  }, [classroomId]);

  React.useEffect(() => {
    classroomId && getCurrentTerm();
  }, [classroomId]);

  return {
    ...terms,

    get,
    getById,
    getByDate,
    create,
    modify,
    remove,

    setSelectedTerm,
  };
};

export default useTerms;
