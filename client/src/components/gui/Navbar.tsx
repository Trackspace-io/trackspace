import { useAuths, useUsers } from 'controllers';
import * as React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Navbar.module.css';
import { Dropdown, DropdownItem, DropdownTrigger } from './Dropdown';
import LinkButton from './LinkButton';

/**
 * Component representing the navbar.
 *
 * @param none
 * @returns ReactNode
 */
const NavbarPublic: React.FC = () => {
  const Users = useUsers();

  return (
    <div>
      {!Users.current.loggedIn && (
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

const NavbarProtected: React.FC = () => {
  const Users = useUsers();
  const Auths = useAuths();

  return (
    <div className={style['container']}>
      <Link to="/">
        <img src={logo} className={style['logo']} />
      </Link>
      <Dropdown>
        <DropdownTrigger>{`${Users.current?.firstName} ${Users.current?.lastName}`}</DropdownTrigger>
        <DropdownItem onClick={Auths.logout}>Logout</DropdownItem>
      </Dropdown>
    </div>
  );
};

const NavbarMini: React.FC = () => {
  const Users = useUsers();
  const Auths = useAuths();

  return (
    <div className={style['container-mini']}>
      <Dropdown>
        <DropdownItem
          link={`/user/${Users.current?.firstName?.toLowerCase()}-${Users.current?.lastName?.toLowerCase()}`}>
          Profile
        </DropdownItem>
        <DropdownItem onClick={Auths.logout}>Logout</DropdownItem>
      </Dropdown>
    </div>
  );
};

export { NavbarPublic, NavbarProtected, NavbarMini };
