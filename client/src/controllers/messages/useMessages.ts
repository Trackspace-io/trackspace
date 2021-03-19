import { useGlobalStore } from 'store';
import messagesReducer from 'store/messages';
import { IMessage } from 'store/messages/types';

const { actions } = messagesReducer;

const useMessages = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of states
  const { messages } = state;

  // List of actions
  const { addMessage, closeMessage } = actions;

  // List of thunks
  /**
   * Update the list of messages
   *
   * @param {string} payload.type
   * @param {string} payload.text
   */
  const add = (payload: IMessage) => {
    dispatch(addMessage(payload));
  };

  const close = () => {
    dispatch(closeMessage);
  };

  return {
    ...messages,

    add,
    close,
  };
};

export default useMessages;
