import { IMessage, MESSAGES } from './types';

export const addMessage = (payload: IMessage) => {
  return {
    type: MESSAGES.ADD,
    payload,
  };
};

export const closeMessage = () => {
  return {
    type: MESSAGES.CLOSE,
  };
};
