import cx from 'classnames';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import style from '../../styles/gui/LinkButton.module.css';

/**
 * Component representing a wrapper for react-router-dom link.
 *
 * @param {{
 * 	to: string,
 *  variant?: 'default' | 'primary' | 'secondary',
 *  align?: 'left' | 'center' | 'right'
 *  children: ReactNode,
 *  history: History
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface ILinkButtonProps extends RouteComponentProps {
  to: string;
  variant?: 'primary' | 'secondary';
  align?: 'left' | 'center' | 'right';
}

const LinkButton: React.FC<ILinkButtonProps> = ({
  children,
  to,
  history,
  variant = 'default',
  align = 'left',
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    history.push(to);
  };

  return (
    <button
      className={cx(style['link-button'], style[variant], style[`align-${align}`])}
      onClick={handleClick}
      {...rest}>
      {children}
    </button>
  );
};

export default withRouter(LinkButton);
