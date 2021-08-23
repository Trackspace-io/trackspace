import Typography from 'components/gui/Typography';
import React from 'react';
import { IGoal } from 'store/goals/types';

import style from './Goals.module.css';
import ModifyGoal from './ModifyGoal';
import UnsetGoal from './UnsetGoal';

const GoalItem: React.FC<{
  classroomId: string;
  goal: IGoal;
}> = ({ classroomId, goal }) => {
  return (
    <div className={style['goal-item']}>
      <span className={style['actions']}>
        <ModifyGoal classroomId={classroomId} weekNumber={goal.weekNumber} pages={goal.pages} />
        <UnsetGoal classroomId={classroomId} weekNumber={goal.weekNumber} />
      </span>
      <Typography variant="info">{`Week ${goal.weekNumber}`}</Typography>
      <Typography variant="title">{goal.pages}</Typography>
      <Typography variant="caption">pages</Typography>
    </div>
  );
};

export default GoalItem;
