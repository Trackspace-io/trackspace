import * as React from 'react';
import style from '../../styles/gui/Typography.module.css';

interface ITypographyProps {
  /** Choose between primary and secondary styling. */
  variant?: 'title' | 'subtitle';
  // onClick?: (e: any) => void;
}

const Typography: React.FC<ITypographyProps> = ({ children, variant = 'default' }) => {
  return <div className={style[variant]}>{children}</div>;
};

export default Typography;
