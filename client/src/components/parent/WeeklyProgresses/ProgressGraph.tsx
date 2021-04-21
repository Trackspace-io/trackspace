import Graph from 'components/common/Graph/Graph';
import { useClassroomsAsParent } from 'controllers';
import React from 'react';

import style from './WeeklyProgresses.module.css';

interface IGraphProps {
  studentId: string;
  termId: string;
}

const ProgressGraph: React.FC<IGraphProps> = ({ termId, studentId }) => {
  // Controllers
  const Classrooms = useClassroomsAsParent();

  // States
  const { progresses, terms } = Classrooms;

  React.useEffect(() => {
    studentId &&
      progresses.getProgressGraph({
        termId,
        studentId,
      });
  }, [studentId, terms.currentTerm?.id]);

  return <div className={style['graph-container']}>{progresses.graph && <Graph graph={progresses.graph} />}</div>;
};

export default ProgressGraph;
