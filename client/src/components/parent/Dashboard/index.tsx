/* eslint-disable @typescript-eslint/no-explicit-any */

import style from './Dashboard.module.css';

import React from 'react';
import { FcBullish, FcPlanner } from 'react-icons/fc';
import { Content, Home, Page } from 'components/gui/Home';
import { FiBookOpen } from 'react-icons/fi';
import Children from '../Children';
import { useParents } from 'controllers';
import { PageGroup } from 'components/gui/Page';
import WeeklyProgresses from '../WeeklyProgresses';
import { IStudent } from 'store/students/types';
import { IClassroom } from 'store/classrooms/types';
import DailyProgress from 'components/common/DailyProgress';

const Dashboard: React.FC = () => {
  const Parents = useParents();

  const classroomPage = (student: IStudent, classroom: IClassroom) => {
    return (
      <Page path={`/classrooms/${classroom.id}`} title={classroom.name}>
        <Content path="/progress/daily" title="Daily progress" icon={<FcPlanner />}>
          <DailyProgress classroomId={classroom.id} studentId={student.id} />
        </Content>
        <Content path="/progress/term" title="Term progress" icon={<FcBullish />}>
          <WeeklyProgresses studentId={student.id} classroomId={classroom.id} />
        </Content>
      </Page>
    );
  };

  const studentGroup = (student: IStudent) => {
    const fullName = `${student.firstName} ${student.lastName}`;

    return (
      <PageGroup path={`/students/${student.id}`} title={fullName}>
        {/* Generate one page per classroom */}
        {(student.classrooms as any[])?.map((classroom) => classroomPage(student, classroom))}
      </PageGroup>
    );
  };

  return (
    <div className={style['container']}>
      <Home path="/parent">
        {/* Home page */}
        <Page path="/home" title="Home" icon={<FiBookOpen />}>
          <Content>
            <Children />
          </Content>
        </Page>

        {/* Generate one group per student */}
        {Parents.children.map((student) => studentGroup(student))}
      </Home>
    </div>
  );
};

export default Dashboard;
