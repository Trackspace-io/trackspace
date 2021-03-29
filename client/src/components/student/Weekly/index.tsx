import React from 'react';
import { useParams } from 'react-router-dom';
import Progresses from './Progresses';
import Terms from './Terms';
import style from './Weekly.module.css';

interface RouteParams {
  id: string;
}

const Weekly: React.FC = () => {
  // Retrieve id
  const { id } = useParams<RouteParams>();

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Terms classroomId={id} />
      </div>
      <div className={style['body']}>
        <Progresses classroomId={id} />
      </div>
    </div>
  );
};
export default Weekly;
