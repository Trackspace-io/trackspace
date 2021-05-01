import 'rc-calendar/assets/index.css';

import Menu from 'components/common/Menu';
import Divider from 'components/gui/Divider';
import Tooltip from 'components/gui/Tooltip';
import { useTeachers } from 'controllers';
import * as React from 'react';
import { FcHome } from 'react-icons/fc';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { IClassroom } from 'store/classrooms/types';

import style from '../../styles/teacher/Dashboard.module.css';
import Classroom from './Classroom';
import Home from './Home';

/**
 * Component representing the Teacher's home page, and access to their classrooms.
 *
 * @param none
 *
 * @returns ReactNode
 */
const Dashboard: React.FC = () => {
  const Teachers = useTeachers();

  return (
    <div className={style['container']}>
      <div className={style['sidebar']}>
        <Sidebar classrooms={Teachers.classroomsList} />
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
      <Tooltip text="Home" position="right">
        <Link to="/teacher" className={style['home']}>
          <FcHome />
        </Link>
      </Tooltip>
      <Divider />
      {classrooms.map((classroom) => (
        <Tooltip key={classroom.id} text={classroom.name} position="right">
          <Link to={`/teacher/classrooms/${classroom.id}`} className={style['bubble']}>
            {classroom.name[0]}
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};

export default Dashboard;
