import { GOALS, IGoalState, IGoalActions } from './types';

/**
 * Initial state.
 */
export const initialState = {
  list: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IGoalState} state    Initial state.
 * @param {IGoalActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IGoalState, action: IGoalActions): IGoalState => {
  switch (action.type) {
    case GOALS.SET_GOALS:
      return { ...state, list: action.payload };

    default:
      return state;
  }
};

export default reducer;
