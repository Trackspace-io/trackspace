import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
// import useClassroom from 'controllers/useClassroom';
import * as React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';

import style from '../../styles/teacher/Classroom.module.css';
import Students from './Students';
import Subjects from './Subjects';
import Terms from './Terms';
interface RouteParams {
  id: string;
}

const Classroom: React.FC = () => {
  const { id } = useParams<RouteParams>();

  // const { classrooms } = useClassroom();
  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">Classroom #</Typography>
      </div>
      <div className={style['body']}>
        <div className={style['sidebar']}>
          <Sidebar>
            <SidebarItem to={`/teacher/classrooms/${id}/students`}> Students </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/subjects`}> Subjects </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/terms`}> Terms </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/goals`}> Goals </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/progress`}> Progress </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route path="/teacher/classrooms/:id/students" component={Students} />
            <Route path="/teacher/classrooms/:id/subjects" component={Subjects} />
            <Route path="/teacher/classrooms/:id/terms" component={Terms} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
