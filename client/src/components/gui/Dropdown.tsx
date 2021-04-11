import cx from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import style from '../../styles/gui/Dropdown.module.css';
import ClickHandler from './ClickHandler';

interface IDropdownProps {
  title?: string;
  icon?: React.ReactNode;
  type: 'icon' | 'title';
}

const Dropdown: React.FC<IDropdownProps> = ({ children, type, icon, title }) => {
  const [isActive, setIsActive] = React.useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const renderTrigger = (type: 'icon' | 'title') => {
    switch (type) {
      case 'title':
        return (
          <button className={style['trigger']} onClick={handleClick}>
            <span> {title} </span>
          </button>
        );
      case 'icon':
        return (
          <span onClick={handleClick} className={style['icon']}>
            {icon}
          </span>
        );
      default:
        throw new Error('Unable to render.');
    }
  };

  return (
    <div className={style['container']}>
      {renderTrigger(type)}
      <ClickHandler onClickOutside={() => setIsActive(false)}>
        <nav className={cx(style['menu'], style[isActive ? 'active' : 'inactive'])} onClick={handleClick}>
          <ul>{children}</ul>
        </nav>
      </ClickHandler>
    </div>
  );
};

interface IDropdownMenuProps {
  type: 'button' | 'link' | 'text';
  to?: string;
  onClick?: () => void;
}

const DropdownItem: React.FC<IDropdownMenuProps> = ({ children, type, to = '', onClick }) => {
  const renderItem = () => {
    switch (type) {
      case 'link':
        return <Link to={to}> {children} </Link>;
      case 'button':
        return <button onClick={onClick}> {children}</button>;
      case 'text':
        return <span> {children} </span>;
      default:
        throw new Error('Unable to render.');
    }
  };

  return <li>{renderItem()}</li>;
};

export { Dropdown, DropdownItem };
