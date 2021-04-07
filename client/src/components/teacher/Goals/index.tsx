import { useClassroomsAsTeacher } from 'controllers';
import { useParams } from 'helpers/params';
import React from 'react';
import GoalList from './GoalList';
import SetGoal from './SetGoal';
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

  console.log('goals', goals.list);

  return (
    <div>
      <Terms />
      <GoalList list={goals.list} />
      <SetGoal />
    </div>
  );
};

export default Goals;
