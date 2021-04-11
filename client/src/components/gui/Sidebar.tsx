import * as React from 'react';
import { Link } from 'react-router-dom';

import style from '../../styles/gui/Sidebar.module.css';

const Sidebar: React.FC = ({ children }) => {
  return <div className={style['sidebar']}>{children}</div>;
};

interface ISidebarItemProps {
  to: string;
  icon?: React.ReactNode;
}

const SidebarItem: React.FC<ISidebarItemProps> = ({ children, icon, to }) => {
  return (
    <Link to={to} className={style['sidebar-item']}>
      <span className={style['icon']}>{icon}</span>
      <span className={style['text']}>{children}</span>
    </Link>
  );
};

const useSidebar = (initialState: string) => {
  const [tab, setTab] = React.useState(initialState);

  return { tab, setTab };
};

export { Sidebar, SidebarItem, useSidebar };
