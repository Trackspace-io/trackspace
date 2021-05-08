import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import * as React from 'react';
import { FcCheckmark, FcCollaboration, FcComboChart, FcOvertime, FcTimeline } from 'react-icons/fc';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';

import style from '../../styles/teacher/Classroom.module.css';
import Goals from './Goals';
import Students from './Students';
import Subjects from './Subjects';
import Terms from './Terms';
import WeeklyProgresses from './WeeklyProgresses';

interface RouteParams {
  id: string;
}

const Classroom: React.FC = () => {
  // URL param :id
  const { id } = useParams<RouteParams>();

  // Controllers
  const Classrooms = useClassroomsAsTeacher(id);

  return (
    <div className={style['container']}>
      <div className={style['sidebar']}>
        <span className={style['title']}>
          <Typography variant="subtitle" display="inline" weight="light">
            {Classrooms.current?.name}
          </Typography>
        </span>
        <Sidebar>
          <SidebarItem to={`/teacher/classrooms/${id}/students`} icon={<FcCollaboration />}>
            Students
          </SidebarItem>
          <SidebarItem to={`/teacher/classrooms/${id}/subjects`} icon={<FcTimeline />}>
            Subjects
          </SidebarItem>
          <SidebarItem to={`/teacher/classrooms/${id}/terms`} icon={<FcOvertime />}>
            Terms
          </SidebarItem>
          <SidebarItem to={`/teacher/classrooms/${id}/goals`} icon={<FcCheckmark />}>
            Goals
          </SidebarItem>
          <SidebarItem to={`/teacher/classrooms/${id}/progresses`} icon={<FcComboChart />}>
            Progress
          </SidebarItem>
        </Sidebar>
      </div>
      <div className={style['content']}>
        <Switch>
          <Route exact path="/teacher/classrooms/:id">
            <Redirect to={`/teacher/classrooms/${id}/students`} />
          </Route>
          <Route path="/teacher/classrooms/:id/students" component={Students} />
          <Route path="/teacher/classrooms/:id/subjects" component={Subjects} />
          <Route path="/teacher/classrooms/:id/terms" component={Terms} />
          <Route path="/teacher/classrooms/:id/goals" component={Goals} />
          <Route path="/teacher/classrooms/:id/progresses" component={WeeklyProgresses} />
        </Switch>
      </div>
    </div>
  );
};

export default Classroom;
