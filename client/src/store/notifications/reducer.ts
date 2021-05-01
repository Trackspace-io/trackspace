import { NOTIFICATIONS, INotificationState, INotificationActions } from './types';

/**
 * Initial state.
 */
export const initialState = {
  list: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {INotificationState}   state   Initial state.
 * @param {INotificationActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: INotificationState, action: INotificationActions): INotificationState => {
  switch (action.type) {
    case NOTIFICATIONS.SET_NOTIFICATIONS:
      return { ...state, list: action.payload };

    default:
      return state;
  }
};

export default reducer;
