import { TermsAPI } from 'api';
import { useMessages } from 'controllers';
import * as React from 'react';
import { useGlobalStore } from 'store';
import termsReducer from 'store/terms';
import { ITermCreate, ITermModify, ITermRemove } from 'store/terms/types';

const { actions } = termsReducer;

const useTerms = (classroomId?: string) => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  const Messages = useMessages();

  // List of states
  const {
    classrooms: { terms },
  } = state;

  // List of actions
  const { setTerms } = actions;

  // List of thunks

  /**
   * Get the list of subjects of a classroom.
   *
   * @param   {string} id The id of the classroom.
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
   * Creates a new term for the classroom.
   *
   * @param   {Date}      term.start        Start date of the term.
   * @param   {Date}      term.end          End date of the term.
   * @param   {string[]}  term.days         List of allowed days of the week in lower-case
   *                                        (e.g. sunday, monday, etc.).
   * @param   {string}    term.classroomID  End date of the term.
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
  const modify = (payload: ITermModify): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      TermsAPI.update(payload)
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
  const remove = (payload: ITermRemove): Promise<any> => {
    const { classroomId } = payload;

    return new Promise((resolve) => {
      TermsAPI.remove(payload)
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

  React.useEffect(() => {
    classroomId && get(classroomId);
  }, [classroomId]);

  return {
    ...terms,

    get,
    create,
    modify,
    remove,
  };
};

export default useTerms;
