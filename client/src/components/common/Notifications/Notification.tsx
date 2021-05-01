import Typography from 'components/gui/Typography';
import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { INotification, INotificationAction, INotificationProcess } from 'store/notifications/types';

import style from './Notifications.module.css';

interface IProps {
  notification: INotification;
  processNotification: (payload: INotificationProcess) => void;
}

const Notification: React.FC<IProps> = ({ notification, processNotification }) => {
  const { id, date, type, text, actions } = notification;

  const getType = () => {
    switch (type) {
      case 'relationConfirmation':
        return 'relation';
      default:
        return '';
    }
  };

  const handleClick = (action: INotificationAction) => {
    processNotification({
      notificationId: id,
      action: action.id,
    });
  };

  const getActions = () => {
    const [a, b] = actions;

    return (
      <React.Fragment>
        <FiX onClick={handleClick.bind(this, b)} />
        <FiCheck onClick={handleClick.bind(this, a)} />
      </React.Fragment>
    );
  };

  return (
    <div className={style['notification']}>
      <header className={style['header']}>
        <Typography variant="caption">{date}</Typography>
      </header>
      <Typography>{text}</Typography>
      <footer className={style['footer']}>
        <span className={style['type']}>
          <Typography variant="caption">{getType()}</Typography>
        </span>
        <span>{getActions()}</span>
      </footer>
    </div>
  );
};

export default Notification;
