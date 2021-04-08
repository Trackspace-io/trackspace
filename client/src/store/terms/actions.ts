import { ITerm, TERMS } from './types';

export const setTerms = (payload: ITerm[]) => {
  return {
    type: TERMS.SET_TERMS,
    payload,
  };
};

export const setCurrentTerm = (payload: ITerm) => {
  return {
    type: TERMS.SET_CURRENT_TERM,
    payload,
  };
};

export const setSelectedTerm = (payload: ITerm) => {
  return {
    type: TERMS.SET_SELECTED_TERM,
    payload,
  };
};
