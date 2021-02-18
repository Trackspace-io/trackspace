import useUser from 'controllers/useUser';
import Cookies from 'js-cookie';
import * as React from 'react';

import { faBell } from '@fortawesome/free-solid-svg-icons';

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
  const User = useUser();

  return (
    <div className={style['container-mini']}>
      <Dropdown type="icon" icon={faBell}>
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
