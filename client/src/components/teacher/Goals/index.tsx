import { useClassroomsAsTeacher } from 'controllers';
import { useParams } from 'helpers/params';
import React from 'react';

import GoalGraph from './GoalGraph';
import GoalList from './GoalList';
import style from './Goals.module.css';
import Terms from './Terms';

const Goals: React.FC = () => {
  // Retrieve classroom id
  const id = useParams();

  const Classrooms = useClassroomsAsTeacher(id);
  const { goals, terms } = Classrooms.current;

  React.useEffect(() => {
    terms.currentTerm?.id &&
      goals.get({
        classroomId: id,
        termId: terms.currentTerm?.id,
      });
  }, [terms.currentTerm?.id]);

  React.useEffect(() => {
    terms.currentTerm?.id &&
      goals.getGraph({
        classroomId: id,
        termId: terms.currentTerm?.id,
        color: `${'9ab986'}`,
        width: 3,
      });
  }, [terms.currentTerm?.id, goals.list]);

  return (
    <div className={style['goal-container']}>
      <Terms />
      <GoalGraph graph={goals.graph} />
      <GoalList list={goals.list} numberOfWeeks={Number(terms.currentTerm?.numberOfWeeks)} />
    </div>
  );
};

export default Goals;
