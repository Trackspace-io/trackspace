import * as React from 'react';
import style from '../../styles/gui/Dropdown.module.css';
import cx from 'classnames';
import ClickHandler from './ClickHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

interface IDropdownProps {
  title?: string;
  icon?: IconDefinition;
  type: 'icon' | 'title';
}

const Dropdown: React.FC<IDropdownProps> = ({ children, type, icon = faEllipsisH, title }) => {
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
        return <FontAwesomeIcon icon={icon} className={style['icon']} onClick={handleClick} />;
      default:
        throw new Error('Unable to render.');
    }
  };

  return (
    <div className={style['container']}>
      {renderTrigger(type)}
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
      <li>{type === 'link' ? <a href={to}> {children} </a> : <span onClick={onClick}> {children}</span>}</li>
    </ul>
  );
};

export { Dropdown, DropdownItem };
