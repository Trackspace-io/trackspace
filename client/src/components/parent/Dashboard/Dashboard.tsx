import Menu from 'components/common/Menu';
import React from 'react';
import { Switch } from 'react-router';
import style from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={style['container']}>
      <div className={style['sidebar']}></div>
      <div className={style['main']}>
        <div className={style['content']}>
          <Switch></Switch>
        </div>
        <div className={style['menu']}>
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
