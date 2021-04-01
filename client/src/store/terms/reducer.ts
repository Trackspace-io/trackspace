import { ITermState, ITermActions, TERMS } from './types';

/**
 * Initial state.
 */
export const initialState = {
  list: [],
  currentTerm: null,
  selectedTerm: null,
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {ITermState} state    Initial state.
 * @param {ITermActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: ITermState, action: ITermActions): ITermState => {
  switch (action.type) {
    case TERMS.SET_TERMS:
      return { ...state, list: action.payload };

    case TERMS.SET_CURRENT_TERM:
      return { ...state, currentTerm: action.payload };

    case TERMS.SET_SELECTED_TERM:
      return { ...state, selectedTerm: action.payload };

    default:
      return state;
  }
};

export default reducer;
