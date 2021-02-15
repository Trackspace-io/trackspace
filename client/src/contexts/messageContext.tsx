import * as React from 'react';
import { IMessage } from 'types';

/* Interface */

/**
 * Message state
 *
 * @param {IMessage[]} messages  List of messages.
 */
export interface MessageState {
  messages: IMessage[];
}

/* Actions */
export type MessageAction = { type: 'UPDATE_MESSAGE'; payload: IMessage } | { type: 'CLOSE_MESSAGE' };

interface IMessageContext {
  state: MessageState;
  dispatch: (action: MessageAction) => void;
}

const initialState: MessageState = {
  messages: [],
};

const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
  switch (action.type) {
    case 'UPDATE_MESSAGE':
      return { ...state, messages: [...state.messages, { ...action.payload, isOpen: true }] };
    case 'CLOSE_MESSAGE':
      const _messages = state.messages.map((m) => {
        m = { ...m, isOpen: false };
        return m;
      });

      return { ...state, messages: _messages };
    // default:
    //   throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const MessageContext = React.createContext<IMessageContext | undefined>(undefined);

const MessageContextProvider = MessageContext.Provider;

const MessageContextConsumer = MessageContext.Consumer;

const MessageProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(messageReducer, initialState);

  return <MessageContextProvider value={{ state, dispatch }}> {children} </MessageContextProvider>;
};

export { MessageProvider, MessageContextProvider, MessageContextConsumer, MessageContext };
