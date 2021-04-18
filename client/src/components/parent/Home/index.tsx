import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import React from 'react';
import { Route, Switch } from 'react-router';
import Children from '../Children';

import style from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">Dashboard</Typography>
      </div>
      <div className={style['body']}>
        <div className={style['sidebar']}>
          <Sidebar>
            <SidebarItem to="/parent/dashboard/children"> Children </SidebarItem>
            <SidebarItem to="/parent/dashboard/settings"> Settings </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route path="/parent/dashboard/children" component={Children} />
          </Switch>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Home;
