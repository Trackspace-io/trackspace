import * as React from 'react';
import cx from 'classnames';
import style from '../../styles/gui/Button.module.css';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Choose between primary and secondary styling. */
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
  // onClick?: (e: any) => void;
}

const Button: React.FC<IButtonProps> = ({ children, variant = 'primary' }) => {
  return <button className={cx(style[variant], style['button'])}>{children}</button>;
};

export default Button;
