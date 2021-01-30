import cx from 'classnames';
import useMessage from 'controllers/useMessage';
import * as React from 'react';

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from '../../styles/gui/Messages.module.css';
import { IMessage } from 'types';

/**
 * Component that displays the global messages.
 */
const Messages: React.FC = () => {
  const { messages, close } = useMessage();

  console.log('messages', messages);
  return (
    <div className={style['container']}>
      {messages.map((m, i) => (
        <Message key={i} message={m} close={close} />
      ))}
    </div>
  );
};

/**
 * Component that represents a message.
 *
 * @param {{
 *  type: string,
 *  text: string,
 *  close: () => void;
 * }} props Props of the component.
 */

interface IMessageProps {
  message: IMessage;
  close: () => void;
}

const Message: React.FC<IMessageProps> = ({ message, close }) => {
  // Hide the notification after 7 seconds.
  React.useEffect(() => {
    setTimeout(() => {
      close();
    }, 7000);
  }, []);

  // Don't show if it is closed.
  if (!message.isOpen) {
    return <div></div>;
  }
  // Get the icon corresponding to the message variant.
  let icon = null;
  switch (message.type) {
    case 'error':
      icon = <FontAwesomeIcon icon={faTimes} />;
      break;
    case 'success':
      icon = <FontAwesomeIcon icon={faCheck} />;
      break;
    default:
      break;
  }

  return (
    <div className={cx(style['notifier'], style[message.type])}>
      {icon} {message.text}
    </div>
  );
};

export default Messages;
