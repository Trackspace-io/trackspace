import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent } from 'controllers';
import React from 'react';
import { FcComboChart, FcInspection } from 'react-icons/fc';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import Today from '../Today';
import WeeklyProgresses from '../WeeklyProgresses';

import style from './Classroom.module.css';

interface RouteParams {
  classroomId: string;
}

const Classroom: React.FC = () => {
  // URL param :id
  const { classroomId } = useParams<RouteParams>();

  // Controllers
  const Classrooms = useClassroomsAsStudent(classroomId);

  return (
    <div>
      <div className={style['container']}>
        <div className={style['sidebar']}>
          <div className={style['title']}>
            <Typography variant="subtitle" display="inline" weight="light">
              {Classrooms.current.name}
            </Typography>
          </div>
          <Sidebar>
            <SidebarItem to={`/student/classrooms/${classroomId}/progress/today`} icon={<FcInspection />}>
              Daily
            </SidebarItem>
            <SidebarItem to={`/student/classrooms/${classroomId}/progress/weekly`} icon={<FcComboChart />}>
              Weekly progress
            </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route exact path="/student/classrooms/:classroomId">
              <Redirect to={`/student/classrooms/${classroomId}/progress/today`} />
            </Route>
            <Route path="/student/classrooms/:classroomId/progress/today" component={Today} />
            <Route path="/student/classrooms/:classroomId/progress/weekly" component={WeeklyProgresses} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
