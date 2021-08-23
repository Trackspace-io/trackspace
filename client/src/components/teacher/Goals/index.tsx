import { useClassroomsAsTeacher } from 'controllers';
import React from 'react';

import GoalGraph from './GoalGraph';
import GoalList from './GoalList';
import Terms from './Terms';

import style from './Goals.module.css';
import Typography from 'components/gui/Typography';

const Goals: React.FC<{
  classroomId: string;
}> = ({ classroomId }) => {
  const Classrooms = useClassroomsAsTeacher(classroomId);
  const { goals, terms } = Classrooms.current;

  React.useEffect(() => {
    terms.currentTerm?.id &&
      goals.get({
        classroomId,
        termId: terms.currentTerm?.id,
      });
  }, [terms.currentTerm?.id]);

  React.useEffect(() => {
    terms.currentTerm?.id &&
      goals.getGraph({
        classroomId,
        termId: terms.currentTerm?.id,
        color: `${'9ab986'}`,
        width: 3,
      });
  }, [terms.currentTerm?.id, goals.list]);

  return (
    <div>
      <Terms classroomId={classroomId} />
      {terms.currentTerm ? (
        <React.Fragment>
          <GoalGraph graph={goals.graph} />
          <GoalList
            classroomId={classroomId}
            list={goals.list}
            numberOfWeeks={Number(terms.currentTerm?.numberOfWeeks)}
          />
        </React.Fragment>
      ) : (
        <div className={style['goals-empty']}>
          <Typography variant="subtitle">No term is associated to the current date.</Typography>
          <Typography variant="subtitle1"> Please add a term, or select a previous term.</Typography>
        </div>
      )}
    </div>
  );
};

export default Goals;
