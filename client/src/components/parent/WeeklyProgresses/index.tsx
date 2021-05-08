import React from 'react';
import { useParams } from 'react-router';

import Progresses from './Progresses';
import Terms from './Terms';
import style from './WeeklyProgresses.module.css';

interface RouteParams {
  studentId: string;
  classroomId: string;
}

const WeeklyProgresses: React.FC = () => {
  // Retrieve id
  const { studentId, classroomId } = useParams<RouteParams>();

  return (
    <div className={style['container']}>
      <header className={style['header']}>
        <Terms classroomId={classroomId} />
      </header>
      <main className={style['main']}>
        <Progresses classroomId={classroomId} studentId={studentId} />
      </main>
    </div>
  );
};

export default WeeklyProgresses;
