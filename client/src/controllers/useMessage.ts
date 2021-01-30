import { MessageContext } from 'contexts/messageContext';
import * as React from 'react';
import { IMessage } from 'types';

interface IMessageController {
  messages: IMessage[];
  update: (payload: IMessage) => void;
  close: () => void;
}

const useMessage = (): IMessageController => {
  const context = React.useContext(MessageContext);

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  /**
   * Update the list of messages
   *
   * @param {string} payload.type
   * @param {string} payload.text
   */
  const update = (payload: IMessage) => {
    context.dispatch({ type: 'UPDATE_MESSAGE', payload: payload });
  };

  const close = () => {
    context.dispatch({ type: 'CLOSE_MESSAGE' });
  };

  const { messages } = context.state;

  return {
    messages,
    update,
    close,
  };
};

export default useMessage;
