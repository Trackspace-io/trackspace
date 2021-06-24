/* eslint-disable @typescript-eslint/no-explicit-any */
import style from '../../styles/gui/Dropdown.module.css';

import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickHandler from './ClickHandler';
import Typography from './Typography';

const Dropdown: React.FC<{
  orientation?: 'left' | 'right';
}> = ({ children, orientation = 'left' }) => {
  const [isActive, setIsActive] = useState(false);
  const [trigger, setTrigger] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    const _triggers: any[] = [];
    const _sections: any[] = [];

    React.Children.forEach(children, (c: any) => {
      if (c.type?.name === DropdownSection.name) {
        _sections.push(c);
      } else if (c.type?.name === DropdownTrigger.name) {
        _triggers.push(c);
      }
    });

    setTrigger(_triggers.length > 0 ? _triggers[0] : null);
    setSections(_sections);
  }, [children]);

  return (
    <div className={style['container']}>
      <div
        className={style['trigger']}
        onClick={() => {
          setIsActive(!isActive);
        }}>
        {trigger ?? null}
      </div>
      <ClickHandler
        onClickOutside={() => {
          setIsActive(false);
        }}>
        <div
          className={cx(style['dropdown'], style[`dropdown-${orientation}`], style[isActive ? 'active' : 'inactive'])}>
          <div
            className={cx(
              style['dropdown-content'],
              style[isActive ? 'active' : 'inactive'],
              style[`dropdown-content-${orientation}`],
            )}>
            {sections}
          </div>
        </div>
      </ClickHandler>
    </div>
  );
};

const DropdownTrigger: React.FC = ({ children }) => {
  return <>{children}</>;
};

const DropdownSection: React.FC<{
  title?: string;
}> = ({ children, title }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(
      React.Children.toArray(children).filter((c) => {
        return (c as any)?.type?.name === DropdownItem.name;
      }),
    );
  }, [children]);

  return (
    <div className={style['section']}>
      {title && (
        <div className={style['section-title']}>
          <Typography variant="caption" weight="bold">
            {title}
          </Typography>
        </div>
      )}
      {items}
    </div>
  );
};

const DropdownItem: React.FC<{
  link?: string;
  onClick?: () => void;
}> = ({ children, link, onClick }) => {
  return (
    <div onClick={onClick} className={cx(style['dropdown-item'], link || onClick ? style['dropdown-action'] : null)}>
      {link ? <Link to={link}>{children}</Link> : children}
    </div>
  );
};

export { Dropdown, DropdownTrigger, DropdownSection, DropdownItem };
