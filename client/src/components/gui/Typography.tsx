import cx from 'classnames';
import * as React from 'react';

import style from '../../styles/gui/Typography.module.css';

/**
 * Component representing a text.
 *
 * @param {{
 * 	variant?: 'default' | 'subtitle' | 'subtitle1' | 'title' | 'caption' | 'info'
 *  align? 'left' | 'center' | 'right'
 *  children: ReactNode
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface ITypographyProps {
  /** Choose between primary and secondary styling. */
  variant?: 'title' | 'subtitle' | 'subtitle1' | 'caption' | 'info';
  align?: 'center' | 'right';
  display?: 'block' | 'inline';
  weight?: 'bold' | 'light';
  // onClick?: (e: any) => void;
}

const Typography: React.FC<ITypographyProps> = ({
  children,
  variant = 'default',
  align = 'left',
  display = 'block',
  weight = 'inherit',
}) => {
  return (
    <p className={cx(style[variant], style[`align-${align}`], style[`display-${display}`], style[`weight-${weight}`])}>
      {children}
    </p>
  );
};

export default Typography;
