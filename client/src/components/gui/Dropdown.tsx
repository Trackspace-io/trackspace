import * as React from 'react';
import style from '../../styles/gui/Dropdown.module.css';
import cx from 'classnames';
import ClickHandler from './ClickHandler';
import { Link } from 'react-router-dom';

interface IDropdownProps {
  title: string;
}

const Dropdown: React.FC<IDropdownProps> = ({ children, title }) => {
  const [isActive, setIsActive] = React.useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={style['container']}>
      <button className={style['trigger']} onClick={handleClick}>
        <span> {title} </span>
      </button>
      <ClickHandler onClickOutside={() => setIsActive(false)}>
        <nav className={cx(style['menu'], style[isActive ? 'active' : 'inactive'])} onClick={handleClick}>
          {children}
        </nav>
      </ClickHandler>
    </div>
  );
};

interface IDropdownMenuProps {
  type: 'button' | 'link';
  to?: string;
  onClick?: () => void;
}

const DropdownItem: React.FC<IDropdownMenuProps> = ({ children, type, to = '', onClick }) => {
  return (
    <ul>
      <li>{type === 'link' ? <Link to={to}> {children} </Link> : <span onClick={onClick}> {children}</span>}</li>
    </ul>
  );
};

export { Dropdown, DropdownItem };
