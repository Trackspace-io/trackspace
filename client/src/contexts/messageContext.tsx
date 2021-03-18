import * as React from 'react';
import { IMessage } from 'store/messages/types';

/* Interface */

/**
 * Message State.
 */
export interface MessageState {
  /* List of messages */
  list: IMessage[];
}

/**
 * Dispatchers. Actions that update the state.
 */
export type MessageAction = { type: 'ADD'; payload: IMessage } | { type: 'CLOSE' };

interface IMessageContext {
  state: MessageState;
  dispatch: (action: MessageAction) => void;
}

/**
 * Initial state.
 */
const initialState: MessageState = {
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
const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'ADD':
      return { ...state, list: [...state.list, { ...action.payload, isOpen: true }] };
    case 'CLOSE':
      const _messages = state.list.map((m) => {
        m = { ...m, isOpen: false };
        return m;
      });

      return { ...state, list: _messages };
    // default:
    //   throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const Ctx = React.createContext<IMessageContext | undefined>(undefined);

const CtxProvider = Ctx.Provider;

const Provider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(messageReducer, initialState);

  return <CtxProvider value={{ state, dispatch }}> {children} </CtxProvider>;
};

export { Ctx, Provider };
