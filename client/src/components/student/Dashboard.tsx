import Menu from 'components/common/Menu';
import Divider from 'components/gui/Divider';
import { useStudents } from 'controllers';

import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IClassroom } from 'store/classrooms/types';

import style from '../../styles/student/Dashboard.module.css';
import Classroom from './Classroom';
import Home from './Home/index';

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
              <Redirect to="/student/classrooms" />
            </Route>
            <Route path="/students/classrooms/invitations/accept" />
            <Route exact path="/student/classrooms" component={Home} />
            <Route path="/student/classrooms/:id" component={Classroom} />
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
      <a href="/student" className={style['bubble']}>
        H
      </a>
      <Divider />
      {classrooms.map((classroom) => (
        <a key={classroom.id} href={`/student/classrooms/${classroom.id}`} className={style['bubble']}>
          {classroom.name[0]}
        </a>
      ))}
    </div>
  );
};

export default Dashboard;
