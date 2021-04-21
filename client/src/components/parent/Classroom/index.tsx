import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsParent } from 'controllers';
import React from 'react';
import { FcComboChart } from 'react-icons/fc';
import { Redirect, Route, Switch, useParams } from 'react-router';

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
        <div className={style['body']}>
          <div className={style['sidebar']}>
            <div className={style['title']}>
              <Typography variant="subtitle">{Classrooms.current.name}</Typography>
            </div>
            <br />
            <Sidebar>
              <SidebarItem
                to={`/parent/children/${studentId}/classrooms/${classroomId}/progress`}
                icon={<FcComboChart />}>
                Weekly progress
              </SidebarItem>
            </Sidebar>
          </div>
          <div className={style['content']}>
            <Switch>
              <Route exact path="/parent/children/:studentId/classrooms/:classroomId">
                <Redirect to={`/parent/children/${studentId}/classrooms/${classroomId}/progress`} />
              </Route>
              <Route path="/parent/children/:studentId/classrooms/:classroomId/progress" component={WeeklyProgresses} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
