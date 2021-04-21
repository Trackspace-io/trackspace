import React from 'react';
import { useParams } from 'react-router';

import style from './WeeklyProgresses.module.css';
// import Progresses from './Progresses';
import Terms from './Terms';

interface RouteParams {
  studentId: string;
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
      <div className={style['body']}>{/* <Progresses classroomId={classroomId} studentId={studentId} /> */}</div>
    </div>
  );
};

export default WeeklyProgresses;
