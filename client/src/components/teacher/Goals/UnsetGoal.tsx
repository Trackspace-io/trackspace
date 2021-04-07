import { useClassroomsAsTeacher } from 'controllers';
import { useParams } from 'helpers/params';
import React from 'react';
import { FiTrash } from 'react-icons/fi';

const UnsetGoal: React.FC = () => {
  // Retrieve classroom id
  const id = useParams();

  const Classrooms = useClassroomsAsTeacher();
  const { goals, terms } = Classrooms.current;

  const handleClick = () => {
    const payload = {
      classroomId: id,
      termId: String(terms.currentTerm?.id),
      weekNumber: 3,
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
