import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Classrooms from './Classrooms';

import style from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div>
      <div className={style['container']}>
        <div className={style['header']}>
          <Typography variant="subtitle">Dashboard</Typography>
        </div>
        <div className={style['body']}>
          <div className={style['sidebar']}>
            <Sidebar>
              <SidebarItem to="/student/classrooms"> My classrooms </SidebarItem>
              <SidebarItem to="/student/settings"> Settings </SidebarItem>
            </Sidebar>
          </div>
          <div className={style['content']}>
            <Switch>
              <Route path="/student/classrooms" component={Classrooms} />
            </Switch>
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default Home;
