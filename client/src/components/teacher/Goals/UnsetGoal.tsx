import { useClassroomsAsTeacher } from 'controllers';
import React from 'react';
import { FiTrash } from 'react-icons/fi';

const UnsetGoal: React.FC<{
  classroomId: string;
  weekNumber: number;
}> = ({ classroomId, weekNumber }) => {
  // Controllers
  const Classrooms = useClassroomsAsTeacher();

  // States
  const { goals, terms } = Classrooms.current;

  const handleClick = () => {
    const payload = {
      classroomId,
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
