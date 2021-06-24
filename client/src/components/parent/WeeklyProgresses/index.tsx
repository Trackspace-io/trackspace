import style from './WeeklyProgresses.module.css';

import React from 'react';
import Progresses from './Progresses';
import Terms from './Terms';

const WeeklyProgresses: React.FC<{
  studentId: string;
  classroomId: string;
}> = ({ studentId, classroomId }) => {
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
