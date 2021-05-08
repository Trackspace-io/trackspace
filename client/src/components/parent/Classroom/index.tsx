import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsParent } from 'controllers';
import React from 'react';
import { FcClock, FcComboChart } from 'react-icons/fc';
import { Redirect, Route, Switch, useParams } from 'react-router';
import Today from '../Today';

import WeeklyProgresses from '../WeeklyProgresses';
import style from './Classroom.module.css';

interface RouteParams {
  classroomId: string;
  studentId: string;
}

const Classroom: React.FC = () => {
  // URL param :id
  const { classroomId, studentId } = useParams<RouteParams>();

  // Controllers
  const Classrooms = useClassroomsAsParent(classroomId);

  return (
    <div>
      <div className={style['container']}>
        <div className={style['sidebar']}>
          <div className={style['title']}>
            <Typography variant="subtitle">{Classrooms.current.name}</Typography>
          </div>
          <Sidebar>
            <SidebarItem
              to={`/parent/children/${studentId}/classrooms/${classroomId}/progresses/today`}
              icon={<FcClock />}>
              Daily
            </SidebarItem>
            <SidebarItem
              to={`/parent/children/${studentId}/classrooms/${classroomId}/progresses/weekly`}
              icon={<FcComboChart />}>
              Weekly progress
            </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route exact path="/parent/children/:studentId/classrooms/:classroomId">
              <Redirect to={`/parent/children/${studentId}/classrooms/${classroomId}/progresses/today`} />
            </Route>
            <Route path="/parent/children/:studentId/classrooms/:classroomId/progresses/today" component={Today} />
            <Route
              path="/parent/children/:studentId/classrooms/:classroomId/progresses/weekly"
              component={WeeklyProgresses}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
