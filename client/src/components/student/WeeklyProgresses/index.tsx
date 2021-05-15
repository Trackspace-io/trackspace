import React from 'react';
import { useParams } from 'react-router-dom';

import Progresses from './Progresses';
import Terms from './Terms';
import style from './Weekly.module.css';

interface RouteParams {
  classroomId: string;
}

const WeeklyProgresses: React.FC = () => {
  // Retrieve id
  const { classroomId } = useParams<RouteParams>();

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
