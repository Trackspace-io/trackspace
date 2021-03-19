import { IClassroomState, IClassroomActions, CLASSROOMS } from './types';

/**
 * Initial state.
 */
export const initialState = {
  current: {},
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IClassroonState} state    Initial state.
 * @param {IClassroomActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IClassroomState, action: IClassroomActions): IClassroomState => {
  switch (action.type) {
    case CLASSROOMS.SET_CURRENT:
      return { ...state, current: action.payload };

    default:
      return state;
  }
};

export default reducer;
