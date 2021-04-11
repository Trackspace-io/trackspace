import React from 'react';
import { FiEdit } from 'react-icons/fi';

import SetGoal from './SetGoal';

interface IUnsetGoalProps {
  weekNumber: number;
  pages: number;
}

const ModifyGoal: React.FC<IUnsetGoalProps> = ({ weekNumber, pages }) => {
  // States
  const [modal, setModal] = React.useState<boolean>(false);

  return (
    <div>
      <FiEdit onClick={() => setModal(true)} />
      {modal && <SetGoal isOpen={modal} onClose={() => setModal(false)} weeks={[weekNumber]} pages={pages} />}
    </div>
  );
};

export default ModifyGoal;
