export interface IInvitation {
  classroomName: string;
  teacherFirstName: string;
  teacherLastName: string;
}

/**
 * Reducer's state interface
 */
export interface IInvitationState {
  // Invitation's information
  info: IInvitation;
}

/**
 * Actions' type
 */
export enum INVITATIONS {
  SET_INFO = 'SET_INFO',
}

/**
 * Reducer's dispatchers interface
 */
export type IInvitationActions = { type: INVITATIONS.SET_INFO; payload: IInvitation };

/**
 * Get invitation interface
 */
export interface IInvitationGet {
  token: string;
}
