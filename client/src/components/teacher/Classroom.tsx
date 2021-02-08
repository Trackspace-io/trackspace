import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import style from '../../styles/teacher/Classroom.module.css';
import Students from './Students';
import Subjects from './Subjects';
import Terms from './Terms';

const Classroom: React.FC = () => {
  return (
    <div className={style['container']}>
      <nav className={style['sidebar']}>
        <ClassroomSidebar />
      </nav>
      <main>
        <section className={style['content']}>
          <Switch>
            <Route path="/teacher/classroom/:id/students" component={Students} />
            <Route path="/teacher/classroom/:id/subjects" component={Subjects} />
            <Route path="/teacher/classroom/:id/terms" component={Terms} />
          </Switch>
        </section>
      </main>
    </div>
  );
};

const ClassroomSidebar: React.FC = () => {
  return (
    <Sidebar>
      <SidebarItem to="/teacher/classroom/1/students"> Students </SidebarItem>
      <SidebarItem to="/teacher/classroom/1/subjects"> Subjects </SidebarItem>
      <SidebarItem to="/teacher/classroom/1/terms"> Terms </SidebarItem>
      <SidebarItem to="/teacher/classroom/1/goals"> Goals </SidebarItem>
      <SidebarItem to="/teacher/classroom/1/progress"> Progress </SidebarItem>
    </Sidebar>
  );
};

export default Classroom;
