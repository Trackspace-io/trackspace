import Graph from 'components/common/Graph/Graph';
import { useClassroomsAsParent } from 'controllers';
import React from 'react';

import style from './WeeklyProgresses.module.css';

interface IProps {
  studentId: string;
  termId: string;
}

const ProgressGraph: React.FC<IProps> = ({ termId, studentId }) => {
  // Controllers
  const Classrooms = useClassroomsAsParent();

  // States
  const { progresses } = Classrooms;

  React.useEffect(() => {
    studentId &&
      termId &&
      progresses.getProgressGraph({
        termId,
        studentId,
      });
  }, [studentId && termId]);

  return <div className={style['graph-container']}>{progresses.graph && <Graph graph={progresses.graph} />}</div>;
};

export default ProgressGraph;
