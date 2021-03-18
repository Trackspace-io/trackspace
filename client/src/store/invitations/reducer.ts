import { INVITATIONS, IInvitationState, IInvitationActions } from './types';

/**
 * Initial state.
 */
export const initialState = {
  info: {
    classroomName: '',
    teacherFirstName: '',
    teacherLastName: '',
  },
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {IStudentState}   state   Initial state.
 * @param {IStudentActions} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IInvitationState, action: IInvitationActions): IInvitationState => {
  switch (action.type) {
    case INVITATIONS.SET_INFO:
      return { ...state, info: action.payload };

    default:
      return state;
  }
};

export default reducer;
