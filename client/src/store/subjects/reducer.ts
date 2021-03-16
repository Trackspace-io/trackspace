import { ISubjectState, ISubjectActions, SUBJECTS } from './types';

/**
 * Initial state.
 */
export const initialState = {
  list: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {ISubjectState} state    Initial state.
 * @param {ISubjectActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: ISubjectState, action: ISubjectActions): ISubjectState => {
  switch (action.type) {
    case SUBJECTS.SET_SUBJECTS:
      return { ...state, list: action.payload };

    default:
      return state;
  }
};

export default reducer;
