import * as React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Navbar.module.css';
import LinkButton from './LinkButton';
import Cookies from 'js-cookie';
import useUser from 'controllers/useUser';
import { Dropdown, DropdownItem } from './Dropdown';

/**
 * Component representing the navbar.
 *
 * @param none
 * @returns ReactNode
 */
const Navbar: React.FC = () => {
  const cookie = Cookies.get('connect.sid');

  const { user, logout } = useUser();

  console.log('state', user);
  return (
    <div className={style['container']}>
      <Link to="/">
        <img src={logo} className={style['logo']} />
      </Link>
      {!cookie ? (
        <LinkButton to="/sign-up" variant="primary">
          Sign Up
        </LinkButton>
      ) : (
        <Dropdown title={`${user?.firstName} ${user?.lastName}`}>
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
