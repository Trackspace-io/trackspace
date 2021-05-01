import { NotificationsAPI } from 'api';
import { useMessages, useUsers } from 'controllers';
import React from 'react';
import { useGlobalStore } from 'store';
import notificationsReducer from 'store/notifications';
import { INotificationProcess } from 'store/notifications/types';

const { actions } = notificationsReducer;

const useNotifications = () => {
  if (useGlobalStore === undefined) {
    throw new Error('useGlobalStore must be used within a Provider');
  }

  const { state, dispatch } = useGlobalStore();

  // List of controllers
  const Messages = useMessages();
  const Users = useUsers();

  // List of states
  const { notifications } = state;

  // List of actions
  const { setNotifications } = actions;

  // List of thunks

  /**
   * Get the notifications of a user
   *
   * @returns Promise
   */
  const getNotifications = () => {
    NotificationsAPI.getNotifications()
      .then((response) => {
        const { data } = response;

        dispatch(setNotifications(data));
      })
      .catch((e) => {
        const { msg } = e.response.data.errors[0];

        Messages.add({
          type: 'error',
          text: `${msg}`,
        });
      });
  };

  /**
   * Process a notification
   *
   * @param {string} action The action to process
   *
   * @returns Promise
   */
  const processNotification = (payload: INotificationProcess) => {
    return new Promise((resolve, reject) => {
      NotificationsAPI.processNotification(payload)
        .then((response) => {
          const { data } = response;

          getNotifications();

          Messages.add({
            type: 'success',
            text: `${payload.action}`,
          });

          resolve(data);
        })
        .catch((e) => {
          const { msg } = e.response.data.errors[0];

          Messages.add({
            type: 'error',
            text: `${msg}`,
          });

          reject();
        });
    });
  };

  React.useEffect(() => {
    getNotifications();
  }, [Users.current.id]);

  return {
    ...notifications,

    getNotifications,
    processNotification,
  };
};

export default useNotifications;
