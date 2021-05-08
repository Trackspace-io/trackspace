import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Parents from '../Parents';
import Classrooms from './Classrooms';

import style from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div>
      <div className={style['container']}>
        <div className={style['sidebar']}>
          <Typography variant="subtitle">Dashboard</Typography>
          <Sidebar>
            <SidebarItem to="/student/classrooms"> Classrooms </SidebarItem>
            <SidebarItem to="/student/parents"> Parents </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route path="/student/classrooms" component={Classrooms} />
            <Route path="/student/parents" component={Parents} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Home;
