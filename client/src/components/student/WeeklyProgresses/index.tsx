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
      <div className={style['header']}>
        <Terms classroomId={classroomId} />
      </div>
      <div className={style['body']}>
        <Progresses classroomId={classroomId} />
      </div>
    </div>
  );
};
export default WeeklyProgresses;
