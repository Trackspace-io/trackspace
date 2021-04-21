import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsParent } from 'controllers';
import React from 'react';
import { FcComboChart } from 'react-icons/fc';
import { Route, Switch, useParams } from 'react-router';
import style from './Classrooms.module.css';
import WeeklyProgresses from '../WeeklyProgresses';

interface RouteParams {
  classroomId: string;
  studentId: string;
}

const Classrooms: React.FC = () => {
  // URL param :id
  const { classroomId, studentId } = useParams<RouteParams>();
  console.log('classroomId', classroomId);
  console.log('studentId', studentId);

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
              <Route path="/parent/children/:studentId/classrooms/:classroomId/progress" component={WeeklyProgresses} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classrooms;
