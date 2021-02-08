import useUser from 'controllers/useUser';
import * as React from 'react';

import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Navbar.module.css';
import { Dropdown, DropdownItem } from './Dropdown';
import LinkButton from './LinkButton';
import Cookies from 'js-cookie';

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

      {/* <a href="/">
        <img src={logo} className={style['logo']} />
      </a>
      {!isAuthenticated ? (
        <LinkButton to="/sign-up" variant="primary">
          Sign Up
        </LinkButton>
      ) : (
        <Dropdown type="title" title={`${user?.firstName} ${user?.lastName}`}>
          <DropdownItem type="link" to={`/user/${user?.firstName?.toLowerCase()}-${user?.lastName?.toLowerCase()}`}>
            Profile
          </DropdownItem>
          <DropdownItem type="button" onClick={logout}>
            Logout
          </DropdownItem>
        </Dropdown>
      )} */}
    </div>
  );
};

const NavbarMini: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <div className={style['container-mini']}>
      <FontAwesomeIcon icon={faBell} className={style['icon']} />
      <Dropdown type="title" title={`${user?.firstName} ${user?.lastName}`}>
        <DropdownItem type="link" to={`/user/${user?.firstName?.toLowerCase()}-${user?.lastName?.toLowerCase()}`}>
          Profile
        </DropdownItem>
        <DropdownItem type="button" onClick={logout}>
          Logout
        </DropdownItem>
      </Dropdown>
    </div>
  );
};

export { Navbar, NavbarMini };
