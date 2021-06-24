import style from './Weekly.module.css';

import React from 'react';
import Progresses from './Progresses';
import Terms from './Terms';

const WeeklyProgresses: React.FC<{
  classroomId: string;
}> = ({ classroomId }) => {
  return (
    <div className={style['container']}>
      <header className={style['header']}>
        <Terms classroomId={classroomId} />
      </header>
      <main className={style['main']}>
        <Progresses classroomId={classroomId} />
      </main>
    </div>
  );
};
export default WeeklyProgresses;
