import { IStudentActions, IStudentState, STUDENTS } from './types';

/**
 * Initial state.
 */
export const initialState = {
  list: [],
  classroomsList: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IStudentState}   state   Initial state.
 * @param {IStudentActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IStudentState, action: IStudentActions): IStudentState => {
  switch (action.type) {
    case STUDENTS.SET_STUDENTS:
      return { ...state, list: action.payload };

    case STUDENTS.SET_CLASSROOMS:
      return { ...state, classroomsList: action.payload };

    default:
      return state;
  }
};

export default reducer;
