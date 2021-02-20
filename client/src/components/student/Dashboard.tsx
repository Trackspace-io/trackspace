import Divider from 'components/gui/Divider';
import { NavbarMini } from 'components/gui/Navbar';
import useStudents from 'controllers/useStudents';
import moment from 'moment';
import { default as SimpleCalendar } from 'rc-calendar';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IClassroom } from 'types';

import style from '../../styles/student/Dashboard.module.css';

const now = moment();

const Dashboard: React.FC = () => {
  const Students = useStudents();

  return (
    <div className={style['container']}>
      <div className={style['sidebar']}>
        <Sidebar classrooms={Students.classroomsList} />
      </div>
      <div className={style['main']}>
        <div className={style['content']}>
          <Switch>
            <Route exact path="/student">
              <Redirect to="/student" />
            </Route>
            <Route path="students/classrooms/invitations/accept" />
            {/* <Route exact path="/teacher/classrooms" component={Home} />
            <Route path="/teacher/classrooms/:id" component={Classroom} /> */}
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
