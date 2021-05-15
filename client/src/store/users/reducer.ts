import { USERS, IUserState, IUserAction } from './types';

/**
 * Initial state.
 */
export const initialState = {
  current: {
    loggedIn: null,
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  },
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IUserState} state    Initial state.
 * @param {IUserAction} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IUserState, action: IUserAction): IUserState => {
  switch (action.type) {
    case USERS.SET_USER:
      return { ...state, current: action.payload };

    default:
      return state;
  }
};

export default reducer;
