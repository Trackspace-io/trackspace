import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';

import Children from '../Children';
import style from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={style['container']}>
      <div className={style['sidebar']}>
        <span className={style['title']}>
          <Typography variant="subtitle" display="inline" weight="light">
            Dashboard
          </Typography>
        </span>
        <Sidebar>
          <SidebarItem to="/parent/dashboard/children"> Students </SidebarItem>
        </Sidebar>
      </div>
      <div className={style['content']}>
        <Switch>
          <Route exact path="/parent/dashboard">
            <Redirect to="/parent/dashboard/children" />
          </Route>
          <Route path="/parent/dashboard/children" component={Children} />
        </Switch>
      </div>
    </div>
  );
};

export default Home;
