import 'rc-calendar/assets/index.css';

import Divider from 'components/gui/Divider';
import moment from 'moment';
import { default as SimpleCalendar } from 'rc-calendar';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import style from '../../styles/teacher/Dashboard.module.css';
import { NavbarMini } from '../gui/Navbar';
import Classroom from './Classroom';
import Home from './Home';
import useClassroom from 'controllers/useClassroom';
import { IClassroom } from 'types';

const now = moment();

/**
 * Component representing the Teacher's home page, and access to their classrooms.
 *
 * @param none
 *
 * @returns ReactNode
 */
const Dashboard: React.FC = () => {
  const { classrooms } = useClassroom();

  return (
    <div className={style['container']}>
      <nav className={style['sidebar']}>
        <Sidebar classrooms={classrooms} />
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

interface ISidebarProps {
  classrooms: IClassroom[];
}

/**
 * Classrooms' navigation tab.
 *
 * @param { IClassroom[] } classrooms List of classrooms
 *
 * @returns ReactNode
 */
const Sidebar: React.FC<ISidebarProps> = ({ classrooms }) => {
  return (
    <div>
      <a href="/teacher" className={style['bubble']}>
        H
      </a>
      <Divider />
      {classrooms.map((classroom) => {
        return (
          <a key={classroom.id} href={`/teacher/classroom/${classroom.id}`} className={style['bubble']}>
            {classroom.name[0]}
          </a>
        );
      })}
    </div>
  );
};

/**
 * Dashboard's menu. It contains components used across different pages.
 *
 * @param none
 *
 * @returns ReactNode
 */
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

export default Dashboard;
