import { TEACHERS, ITeacherState, ITeacherActions } from './types';

/**
 * Initial state.
 */
export const initialState = {
  classroomsList: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {MessageState} state    Initial state.
 * @param {MessageAction} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: ITeacherState, action: ITeacherActions): ITeacherState => {
  switch (action.type) {
    case TEACHERS.SET_CLASSROOMS:
      return { ...state, classroomsList: action.payload };

    default:
      return state;
  }
};

export default reducer;
