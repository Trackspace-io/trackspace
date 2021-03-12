import useUser from 'controllers/useUser';
import Cookies from 'js-cookie';
import * as React from 'react';

import { FiInbox } from 'react-icons/fi';

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Navbar.module.css';
import { Dropdown, DropdownItem } from './Dropdown';
import LinkButton from './LinkButton';

/**
 * Component representing the navbar.
 *
 * @param none
 * @returns ReactNode
 */
const Navbar: React.FC = () => {
  const cookie = Cookies.get('connect.sid') || '';

  return (
    <div>
      {!cookie && (
        <div className={style['container']}>
          <a href="/">
            <img src={logo} className={style['logo']} />
          </a>
          <LinkButton to="/sign-up" variant="primary">
            Sign Up
          </LinkButton>
        </div>
      )}
    </div>
  );
};

const NavbarMini: React.FC = () => {
  const User = useUser();

  return (
    <div className={style['container-mini']}>
      <Dropdown type="icon" icon={<FiInbox />}>
        <DropdownItem type="text">Notification</DropdownItem>
      </Dropdown>
      <Dropdown type="title" title={`${User.current?.firstName} ${User.current?.lastName}`}>
        <DropdownItem
          type="link"
          to={`/user/${User.current?.firstName?.toLowerCase()}-${User.current?.lastName?.toLowerCase()}`}>
          Profile
        </DropdownItem>
        <DropdownItem type="button" onClick={User.logout}>
          Logout
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export { Navbar, NavbarMini };
