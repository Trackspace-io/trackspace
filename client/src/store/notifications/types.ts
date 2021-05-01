export interface INotificationAction {
  id: string;
  text: string;
}

/**
 * Notification state interface
 */
export interface INotification {
  id: string;
  type: string;
  text: string;
  date: string;
  actions: INotificationAction[];
}

/**
 * Reducer's state interface
 */
export interface INotificationState {
  // List of notifications
  list: INotification[];
}

/**
 * Actions' type
 */
export enum NOTIFICATIONS {
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
}

/**
 * Reducer's dispatchers interface
 */
export type INotificationActions = { type: NOTIFICATIONS.SET_NOTIFICATIONS; payload: INotification[] };

export interface INotificationProcess {
  notificationId: string;
  action: string;
}
