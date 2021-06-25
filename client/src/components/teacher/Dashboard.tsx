import 'rc-calendar/assets/index.css';
import style from '../../styles/teacher/Dashboard.module.css';

import { useTeachers } from 'controllers';
import * as React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { Content, Home, Page } from 'components/gui/Home';
import { FcApproval, FcBookmark, FcCalendar, FcComboChart, FcGraduationCap } from 'react-icons/fc';
import Subjects from './Subjects';
import Students from './Students';
import Terms from './Terms';
import Goals from './Goals';
import WeeklyProgresses from './WeeklyProgresses';
import Classrooms from './Classrooms';

/**
 * Component representing the Teacher's home page, and access to their classrooms.
 */
const Dashboard: React.FC = () => {
  const Teachers = useTeachers();

  return (
    <div className={style['container']}>
      <Home path="/teacher">
        {/* Home page */}
        <Page path="/home" title="Home" icon={<FiBookOpen />}>
          <Content>
            <Classrooms />
          </Content>
        </Page>

        {/* Generate one page per classroom */}
        {Teachers.classroomsList.map((classroom, index) => (
          <Page key={index} path={`/classrooms/${classroom.id}`} title={classroom.name}>
            <Content path="/students" icon={<FcGraduationCap />} title="Students">
              <Students classroomId={classroom.id} />
            </Content>
            <Content path="/subjects" icon={<FcBookmark />} title="Subjects">
              <Subjects classroomId={classroom.id} />
            </Content>
            <Content path="/terms" icon={<FcCalendar />} title="Terms">
              <Terms classroomId={classroom.id} />
            </Content>
            <Content path="/goals" icon={<FcApproval />} title="Goals">
              <Goals classroomId={classroom.id} />
            </Content>
            <Content path="/progress" icon={<FcComboChart />} title="Progress">
              <WeeklyProgresses classroomId={classroom.id} />
            </Content>
          </Page>
        ))}
      </Home>
    </div>
  );
};

export default Dashboard;
