import { IProgressesActions, IProgressState, PROGRESSES } from './types';

/**
 * Initial state.
 */
export const initialState = {
  byDate: {},
  byWeek: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IProgressState}      state   Initial state.
 * @param {IProgressesActions}  action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IProgressState, action: IProgressesActions): IProgressState => {
  switch (action.type) {
    case PROGRESSES.SET_PROGRESSES_BY_DATE:
      return { ...state, byDate: action.payload };

    case PROGRESSES.SET_PROGRESSES_BY_WEEK:
      return { ...state, byWeek: [...state.byWeek, action.payload] };

    case PROGRESSES.CLEAR_PROGRESSES_BY_WEEK:
      return { ...state, byWeek: [] };

    default:
      return state;
  }
};

export default reducer;
