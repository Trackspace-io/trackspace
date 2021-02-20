import * as React from 'react';
import style from '../../styles/gui/Tooltip.module.css';
import cx from 'classnames';

interface ITooltipProps {
  text: string;
  position: 'left' | 'top' | 'right' | 'bottom';
}

const Tooltip: React.FC<ITooltipProps> = ({ children, text, position }) => {
  return (
    <div className={style['tooltip']}>
      <div className={cx(style['text'], style[`position-${position}`])}>{text}</div>
      {children}
    </div>
  );
};

export default Tooltip;
