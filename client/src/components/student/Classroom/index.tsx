import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent } from 'controllers';
import React from 'react';
import { FcComboChart, FcInspection } from 'react-icons/fc';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import Today from '../Today';
import Weekly from '../Weekly';

import style from './Classroom.module.css';

interface RouteParams {
  id: string;
}

const Classroom: React.FC = () => {
  // URL param :id
  const { id } = useParams<RouteParams>();

  // Controllers
  const Classrooms = useClassroomsAsStudent(id);

  return (
    <div>
      <div className={style['container']}>
        <div className={style['header']}>
          <Typography variant="subtitle">{Classrooms.current.name}</Typography>
        </div>
        <div className={style['body']}>
          <div className={style['sidebar']}>
            <Sidebar>
              <SidebarItem to={`/student/classrooms/${id}/progress/today`} icon={<FcInspection />}>
                Today
              </SidebarItem>
              <SidebarItem to={`/student/classrooms/${id}/progress/weekly`} icon={<FcComboChart />}>
                Weekly progress
              </SidebarItem>
            </Sidebar>
          </div>
          <div className={style['content']}>
            <Switch>
              <Route exact path="/student/classrooms/:id">
                <Redirect to={`/student/classrooms/${id}/progress/today`} />
              </Route>
              <Route path="/student/classrooms/:id/progress/today" component={Today} />
              <Route path="/student/classrooms/:id/progress/weekly" component={Weekly} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
