import Graph from 'components/common/Graph/Graph';
import { useClassroomsAsStudent } from 'controllers';
import React from 'react';
import style from './Weekly.module.css';

interface IGraphProps {
  studentId: string;
  termId: string;
}

const ProgressGraph: React.FC<IGraphProps> = ({ termId, studentId }) => {
  // Controllers
  const Classrooms = useClassroomsAsStudent();

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
