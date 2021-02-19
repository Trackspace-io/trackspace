import 'rc-calendar/assets/index.css';

import Divider from 'components/gui/Divider';
import useClassrooms from 'controllers/useClassrooms';
import moment from 'moment';
import { default as SimpleCalendar } from 'rc-calendar';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IClassroom } from 'types';

import style from '../../styles/teacher/Dashboard.module.css';
import { NavbarMini } from '../gui/Navbar';
import Classroom from './Classroom';
import Home from './Home';

const now = moment();

/**
 * Component representing the Teacher's home page, and access to their classrooms.
 *
 * @param none
 *
 * @returns ReactNode
 */
const Dashboard: React.FC = () => {
  const Classrooms = useClassrooms();

  return (
    <div className={style['container']}>
      <div className={style['sidebar']}>
        <Sidebar classrooms={Classrooms.list} />
      </div>
      <div className={style['main']}>
        <div className={style['content']}>
          <Switch>
            <Route exact path="/teacher">
              <Redirect to="/teacher/classrooms" />
            </Route>
            <Route exact path="/teacher/classrooms" component={Home} />
            <Route path="/teacher/classrooms/:id" component={Classroom} />
          </Switch>
        </div>
        <div className={style['menu']}>
          <Menu />
        </div>
      </div>
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
      {classrooms.map((classroom) => (
        <a key={classroom.id} href={`/teacher/classrooms/${classroom.id}`} className={style['bubble']}>
          {classroom.name[0]}
        </a>
      ))}
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
