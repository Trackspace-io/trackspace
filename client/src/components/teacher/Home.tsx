import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import * as React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <Typography variant="subtitle"> Dashboard </Typography>
      <Sidebar>
        <SidebarItem to="/teacher/classroom/create"> Add Classroom </SidebarItem>
        <SidebarItem to="/teacher/classroom/1/subjects"> Subjects </SidebarItem>
      </Sidebar>
      <br />
      <br />
    </div>
  );
};

export default Home;
