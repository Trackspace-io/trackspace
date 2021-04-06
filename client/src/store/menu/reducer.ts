import { MENU, IMenuState, IMenuActions } from './types';
import moment from 'moment';

const now = moment();

/**
 * Initial state.
 */
export const initialState = {
  date: now,
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IMenuState} state    Initial state.
 * @param {IMenuActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IMenuState, action: IMenuActions): IMenuState => {
  switch (action.type) {
    case MENU.SET_DATE:
      return { ...state, date: action.payload };

    default:
      return state;
  }
};

export default reducer;
