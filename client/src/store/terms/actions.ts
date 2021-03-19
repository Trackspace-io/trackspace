import { ITerm, TERMS } from './types';

export const setTerms = (payload: ITerm[]) => {
  return {
    type: TERMS.SET_TERMS,
    payload,
  };
};
