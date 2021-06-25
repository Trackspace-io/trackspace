import style from '../../styles/gui/Sidebar.module.css';

import * as React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = ({ children }) => {
  return <div className={style['sidebar']}>{children}</div>;
};

const SidebarItem: React.FC<{
  to: string;
  icon?: React.ReactNode;
}> = ({ children, icon, to }) => {
  return (
    <Link to={to} className={style['sidebar-item']}>
      <span className={style['icon']}>{icon}</span>
      <span className={style['text']}>{children}</span>
    </Link>
  );
};

export { Sidebar, SidebarItem };
