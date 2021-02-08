import 'rc-calendar/assets/index.css';

import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import moment from 'moment';
import { default as SimpleCalendar } from 'rc-calendar';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import style from '../../styles/teacher/Dashboard.module.css';
import { NavbarMini } from '../gui/Navbar';
import Classroom from './Classroom';

const now = moment();

const Dashboard: React.FC = () => {
  return (
    <div className={style['container']}>
      <nav className={style['sidebar']}>
        <Sidebar />
      </nav>
      <main className={style['main']}>
        <section className={style['content']}>
          <Switch>
            <Route exact path="/teacher" component={Home} />
            <Route path="/teacher/classroom/:id" component={Classroom} />
          </Switch>
        </section>
        <section className={style['menu']}>
          <Menu />
        </section>
      </main>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div>
      <a href="/teacher" className={style['bubble']}>
        H
      </a>
      <Divider />
      <a href="/teacher/classroom/1" className={style['bubble']}>
        C
      </a>
      <a href="/teacher/classroom/2" className={style['bubble']}>
        T
      </a>
    </div>
  );
};

const Menu: React.FC = () => {
  return (
    <div>
      <NavbarMini />
      <br />
      <br />
      <SimpleCalendar
        style={{ margin: '0 auto' }}
        showDateInput={false}
        dateInputPlaceholder="please input"
        format={'YYYY-MM-DD'}
        defaultValue={now}
      />
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div>
      <Typography variant="subtitle"> Dashboard </Typography>
      <br />
      <br />
    </div>
  );
};

export default Dashboard;
