import * as React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Navbar.module.css';
import LinkButton from './LinkButton';
import useUser from 'controllers/useUser';
import { Dropdown, DropdownItem } from './Dropdown';

/**
 * Component representing the navbar.
 *
 * @param none
 * @returns ReactNode
 */
const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useUser();

  return (
    <div className={style['container']}>
      <Link to="/">
        <img src={logo} className={style['logo']} />
      </Link>
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
      )}
    </div>
  );
};

export default Navbar;
