/* eslint-disable @typescript-eslint/no-explicit-any */

import style from '../../styles/gui/Notifications.module.css';

import { useNotifications } from 'controllers';
import React from 'react';

/**
 * Component displaying a list of notifications.
 */
const Notifications: React.FC = () => {
  const Notifications = useNotifications();

  if (Notifications.list?.length == 0) {
    return <div className={style['container']}>(Empty)</div>;
  }

  return (
    <div className={style['container']}>
      {Notifications.list.map((notif, index) => (
        <Notification key={index} notif={notif} />
      ))}
    </div>
  );
};

/**
 * Component representing a notification.
 */
const Notification: React.FC<{ notif: any }> = ({ notif }) => {
  const Notifications = useNotifications();

  return (
    <div className={style['notification']}>
      <div className={style['text']}>{notif.text}</div>
      <div className={style['actions']}>
        {(notif.actions as any[]).map((action, index) => (
          <div
            key={index}
            className={style['action']}
            onClick={() => {
              Notifications.processNotification({
                notificationId: notif.id,
                action: action.id,
              });
            }}>
            {action.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Notifications };
