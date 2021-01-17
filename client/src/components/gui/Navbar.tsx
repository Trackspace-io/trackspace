import * as React from 'react';
import style from '../../styles/gui/Navbar.module.css';
import logo from '../../images/logo.svg';
import Button from './Button';

const Navbar: React.FC = () => {
  return (
    <div className={style['container']}>
      <img src={logo} className={style['logo']} />
      <Button variant="primary">Sign up</Button>
    </div>
  );
};

export default Navbar;
