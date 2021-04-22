import { IParentState, IParentActions, PARENTS } from './types';

/**
 * Initial state.
 */
export const initialState = {
  children: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IParentState}   state   Initial state.
 * @param {IParentActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IParentState, action: IParentActions): IParentState => {
  switch (action.type) {
    case PARENTS.SET_CHILDREN:
      return { ...state, children: action.payload };

    default:
      return state;
  }
};

export default reducer;
