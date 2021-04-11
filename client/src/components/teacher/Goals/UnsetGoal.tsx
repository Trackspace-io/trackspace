import { useClassroomsAsTeacher } from 'controllers';
import { useParams } from 'helpers/params';
import React from 'react';
import { FiTrash } from 'react-icons/fi';

interface IUnsetGoalProps {
  weekNumber: number;
}

const UnsetGoal: React.FC<IUnsetGoalProps> = ({ weekNumber }) => {
  // Retrieve classroom id
  const id = useParams();

  // Controllers
  const Classrooms = useClassroomsAsTeacher();

  // States
  const { goals, terms } = Classrooms.current;

  const handleClick = () => {
    const payload = {
      classroomId: id,
      termId: String(terms.currentTerm?.id),
      weekNumber: weekNumber,
    };

    goals.unset(payload);
  };

  return (
    <div>
      <FiTrash onClick={handleClick} />
    </div>
  );
};

export default UnsetGoal;
