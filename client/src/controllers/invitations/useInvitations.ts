import { StudentsAPI } from 'api';
import { useMessages } from 'controllers';
import { useGlobalStore } from 'store';
import invitationsReducer from 'store/invitations';
import { IInvitationGet } from 'store/invitations/types';

const { actions } = invitationsReducer;

const useInvitations = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();

  // List of states
  const { invitations } = state;

  // List of actions
  const { setInvitationInfo } = actions;

  /**
   * Get the invitation's information
   *
   * @param   {string} token  The invitation token
   *
   * @returns Promise
   */
  const get = (payload: IInvitationGet) => {
    return new Promise((resolve) => {
      StudentsAPI.getInvitationInfo(payload)
        .then((response) => {
          const { data } = response;

          dispatch(setInvitationInfo(data));

          resolve(data);
        })
        .catch((e) => {
          const { data } = e.response;

          Messages.add({
            type: 'error',
            text: `${data}`,
          });
        });
    });
  };

  return {
    ...invitations,

    get,
  };
};

export default useInvitations;
