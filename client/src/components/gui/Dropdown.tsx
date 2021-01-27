import * as React from 'react';
import style from '../../styles/gui/Dropdown.module.css';
import cx from 'classnames';
import LinkButton from './LinkButton';
import ClickHandler from './ClickHandler';

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
  to: string;
}

const DropdownItem: React.FC<IDropdownMenuProps> = ({ children, to }) => {
  return (
    <ul>
      <li>
        <LinkButton to={to} variant="secondary">
          {children}
        </LinkButton>
      </li>
    </ul>
  );
};

export { Dropdown, DropdownItem };
