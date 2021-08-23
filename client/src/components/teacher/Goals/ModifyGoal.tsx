import React from 'react';
import { FiEdit } from 'react-icons/fi';

import SetGoal from './SetGoal';

const ModifyGoal: React.FC<{
  classroomId: string;
  weekNumber: number;
  pages: number;
}> = ({ classroomId, weekNumber, pages }) => {
  // States
  const [modal, setModal] = React.useState<boolean>(false);

  return (
    <div>
      <FiEdit onClick={() => setModal(true)} />
      {modal && (
        <SetGoal
          classroomId={classroomId}
          isOpen={modal}
          onClose={() => setModal(false)}
          weeks={[weekNumber]}
          pages={pages}
        />
      )}
    </div>
  );
};

export default ModifyGoal;
