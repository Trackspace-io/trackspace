import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import { useNotifications } from 'controllers';
import React from 'react';

import Notification from './Notification';
import style from './Notifications.module.css';

const Notifications: React.FC = () => {
  const Notifications = useNotifications();

  return (
    <div className={style['container']}>
      <Typography variant="info">Notifications</Typography>
      <Divider />
      {Notifications.list.length !== 0 ? (
        Notifications.list.map((n) => (
          <Notification key={n.id} notification={n} processNotification={Notifications.processNotification} />
        ))
      ) : (
        <Typography variant="caption" align="center">
          No new notification
        </Typography>
      )}
    </div>
  );
};

export default Notifications;
