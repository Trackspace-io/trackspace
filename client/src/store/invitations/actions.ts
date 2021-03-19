import { IInvitation, INVITATIONS } from './types';

export const setInvitationInfo = (payload: IInvitation) => {
  return {
    type: INVITATIONS.SET_INFO,
    payload,
  };
};
