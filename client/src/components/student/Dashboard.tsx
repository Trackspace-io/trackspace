import style from '../../styles/student/Dashboard.module.css';

import { useStudents, useUsers } from 'controllers';
import { FcReading, FcPlanner } from 'react-icons/fc';
import { FiBookOpen } from 'react-icons/fi';
import * as React from 'react';
import { Content, Home, Page } from 'components/gui/Home';
import Classrooms from './Classrooms';
import Parents from './Parents';
import WeeklyProgresses from './WeeklyProgresses';
import DailyProgress from 'components/common/DailyProgress';

const Dashboard: React.FC = () => {
  const Users = useUsers();
  const Students = useStudents();

  return (
    <div className={style['container']}>
      {/* Home page */}
      <Home path="/student">
        <Page path="/home" title="Home" icon={<FiBookOpen />}>
          <Content path="/classrooms" title="Classrooms">
            <Classrooms />
          </Content>
          <Content path="/parents" title="Parents">
            <Parents />
          </Content>
        </Page>

        {/* Generate one page per classroom */}
        {Students.classroomsList.map((classroom, index) => (
          <Page key={index} path={`/classrooms/${classroom.id}`} title={classroom.name}>
            <Content path="/daily" title="Daily progress" icon={<FcPlanner />}>
              <DailyProgress classroomId={classroom.id} studentId={Users.current?.id} />
            </Content>
            <Content path="/weekly" title="Weekly progress" icon={<FcReading />}>
              <WeeklyProgresses classroomId={classroom.id} />
            </Content>
          </Page>
        ))}
      </Home>
    </div>
  );
};

export default Dashboard;
