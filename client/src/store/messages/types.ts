/**
 * Message interface
 */
export interface IMessage {
  id?: string;
  isOpen?: boolean;
  type: string;
  text: string;
}

/**
 * Reducer's state interface
 */
export interface IMessageState {
  /* List of messages */
  list: IMessage[];
}

/**
 * Actions' type
 */
export enum MESSAGES {
  ADD = 'ADD',
  CLOSE = 'CLOSE',
}

/**
 * Reducer's dispatchers interface
 */
export type IMessageActions = { type: MESSAGES.ADD; payload: IMessage } | { type: MESSAGES.CLOSE; messageId: string };
