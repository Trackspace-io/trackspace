import * as React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../images/logo.svg';
import style from '../../styles/gui/Navbar.module.css';
import LinkButton from './LinkButton';

/**
 * Component representing the navbar.
 *
 * @param none
 * @returns ReactNode
 */
const Navbar: React.FC = () => {
  return (
    <div className={style['container']}>
      <Link to="/">
        <img src={logo} className={style['logo']} />
      </Link>
      <LinkButton to="/sign-up" variant="primary">
        Sign Up
      </LinkButton>
    </div>
  );
};

export default Navbar;
