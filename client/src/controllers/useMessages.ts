import { MessageContext } from 'contexts';
import * as React from 'react';
import { IMessage } from 'types';

interface IMessageController {
  list: IMessage[];

  add: (payload: IMessage) => void;
  close: () => void;
}

const useMessages = (): IMessageController => {
  const context = React.useContext(MessageContext.Ctx);

  if (context === undefined) {
    throw new Error('MessageContext  must be used within a Provider');
  }

  // States
  const { list } = context.state;

  /**
   * Update the list of messages
   *
   * @param {string} payload.type
   * @param {string} payload.text
   */
  const add = (payload: IMessage) => {
    context.dispatch({ type: 'ADD', payload });
  };

  const close = () => {
    context.dispatch({ type: 'CLOSE' });
  };

  return {
    // States
    list,

    // Dispatchers
    add,
    close,
  };
};

export default useMessages;
