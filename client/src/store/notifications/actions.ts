import { INotification, NOTIFICATIONS } from './types';

export const setNotifications = (payload: INotification[]) => {
  return {
    type: NOTIFICATIONS.SET_NOTIFICATIONS,
    payload,
  };
};
