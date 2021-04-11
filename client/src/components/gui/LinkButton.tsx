import cx from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import style from '../../styles/gui/LinkButton.module.css';

/**
 * Component representing a wrapper for react-router-dom link.
 *
 * @param {{
 * 	to: string,
 *  variant?: 'default' | 'primary' | 'secondary',
 *  align?: 'start' | 'center' | 'end'
 *  children: ReactNode,
 *  history: History
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface ILinkButtonProps {
  to: string;
  variant?: 'primary' | 'secondary';
  align?: 'start' | 'center' | 'end';
}

const LinkButton: React.FC<ILinkButtonProps> = ({ children, to, variant = 'default', align = 'start', ...rest }) => {
  return (
    <Link to={to} className={cx(style['link-button'], style[variant], style[`align-${align}`])} {...rest}>
      {children}
    </Link>
  );
};

export default LinkButton;
