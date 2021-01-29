import cx from 'classnames';
import * as React from 'react';

import style from '../../styles/gui/Button.module.css';

/**
 * Component representing an button.
 *
 * @param {{
 * 	variant: 'primary' | 'secondary',
 * 	fullWidth: boolean,
 *  children: ReactNode
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /* Choose between primary and secondary styling. */
  variant: 'primary' | 'secondary';

  /* Set the button to max width */
  fullWidth?: boolean;
  type?: 'submit' | 'reset' | 'button';
  float?: 'right' | 'left';
}

const Button: React.FC<IButtonProps> = ({
  children,
  variant = 'primary',
  type = 'submit',
  float = 'none',
  fullWidth = false,
}) => {
  return (
    <button
      className={cx(style[variant], style['button'], style[`fullWidth-${fullWidth}`], style[`float-${float}`])}
      type={type}>
      {children}
    </button>
  );
};

export default Button;
