import * as React from 'react';
import style from '../../styles/gui/Sidebar.module.css';

const Sidebar: React.FC = ({ children }) => {
  return <div className={style['sidebar']}>{children}</div>;
};

interface ISidebarItemProps {
  to: string;
}

const SidebarItem: React.FC<ISidebarItemProps> = ({ children, to }) => {
  return (
    <a href={to} className={style['sidebar-item']}>
      {children}
    </a>
  );
};

const useSidebar = (initialState: string) => {
  const [tab, setTab] = React.useState(initialState);

  return { tab, setTab };
};

export { Sidebar, SidebarItem, useSidebar };
