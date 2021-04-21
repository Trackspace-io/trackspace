import Menu from 'components/common/Menu';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import Classrooms from '../Classrooms';

import Home from '../Home';
import Sidebar from '../Sidebar';
import style from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={style['container']}>
      <div className={style['sidebar']}>
        <Sidebar />
      </div>
      <div className={style['main']}>
        <div className={style['content']}>
          <Switch>
            <Route exact path="/parent">
              <Redirect to="/parent/dashboard" />
            </Route>
            <Route exact path="/parent/dashboard" component={Home} />
            <Route exact path="/parent/dashboard/children" component={Home} />
            <Route exact path="/parent/children/:studentId/classrooms/:classroomId" component={Classrooms} />
            <Route exact path="/parent/children/:studentId/classrooms/:classroomId/progress" component={Classrooms} />
          </Switch>
        </div>
        <div className={style['menu']}>
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
