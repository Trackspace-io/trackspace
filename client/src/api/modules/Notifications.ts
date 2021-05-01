import { _apiUrl } from 'api/api';
import axios from 'axios';
import { INotificationProcess } from 'store/notifications/types';

/**
 * Get the notifications of a user.
 *
 * @method GET
 * @url    /users/notifications
 *
 * @returns 200, 400, 401, 500
 */
export const getNotifications = async (): Promise<any> => {
  return await axios.get(`${_apiUrl}/api/users/notifications`, {
    withCredentials: true,
  });
};

/**
 * Process a notifications.
 *
 * @method GET
 * @url    /users/notifications/process?action={action}
 *
 * @param {string}  query.action  The action selected by the user.
 *
 * @returns 200, 400, 401, 500
 */
export const processNotification = async (body: INotificationProcess): Promise<any> => {
  console.log('body', body);

  return await axios.post(
    `${_apiUrl}/api/users/notifications/${body.notificationId}/process?action=${body.action}`,
    {},
    { withCredentials: true },
  );
};
