import cx from 'classnames';
import * as React from 'react';

import style from '../../styles/gui/Typography.module.css';

/**
 * Component representing a text.
 *
 * @param {{
 * 	variant?: 'default' | 'subtitle' | 'title' | 'caption' | 'info'
 *  align? 'left' | 'center' | 'right'
 *  children: ReactNode
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface ITypographyProps {
  /** Choose between primary and secondary styling. */
  variant?: 'title' | 'subtitle' | 'caption' | 'info';
  align?: 'center' | 'right';
  // onClick?: (e: any) => void;
}

const Typography: React.FC<ITypographyProps> = ({ children, variant = 'default', align = 'left' }) => {
  return <div className={cx(style[variant], style[`align-${align}`])}>{children}</div>;
};

export default Typography;
