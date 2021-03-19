import { IMessageState, IMessageActions, MESSAGES } from './types';

/**
 * Initial state.
 */
export const initialState = {
  list: [],
};

/**
 * State management reducer pattern. Accepts an initial state, returns the current application state, then dispatches functions.
 *
 * @param {MessageState} state    Initial state.
 * @param {MessageAction} action  Dispatchers.
 *
 * @returns The current state
 */
const reducer = (state: IMessageState, action: IMessageActions): IMessageState => {
  switch (action.type) {
    case MESSAGES.ADD:
      return { ...state, list: [...state.list, { ...action.payload, isOpen: true }] };

    case MESSAGES.CLOSE:
      const _messages = state.list.map((m) => {
        m = { ...m, isOpen: false };
        return m;
      });

      return { ...state, list: _messages };

    default:
      return state;
  }
};

export default reducer;
