import { useAuths, useUsers } from 'controllers';
import Cookies from 'js-cookie';
import * as React from 'react';
import { FiInbox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
          <Link to="/">
            <img src={logo} className={style['logo']} />
          </Link>
          <LinkButton to="/sign-up" variant="primary">
            Sign Up
          </LinkButton>
        </div>
      )}
    </div>
  );
};

const NavbarMini: React.FC = () => {
  const Users = useUsers();
  const Auths = useAuths();

  return (
    <div className={style['container-mini']}>
      <Dropdown type="icon" icon={<FiInbox />}>
        <DropdownItem type="text">Notification</DropdownItem>
      </Dropdown>
      <Dropdown type="title" title={`${Users.current?.firstName} ${Users.current?.lastName}`}>
        <DropdownItem
          type="link"
          to={`/user/${Users.current?.firstName?.toLowerCase()}-${Users.current?.lastName?.toLowerCase()}`}>
          Profile
        </DropdownItem>
        <DropdownItem type="button" onClick={Auths.logout}>
          Logout
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export { Navbar, NavbarMini };
