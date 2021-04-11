import Typography from 'components/gui/Typography';
import React from 'react';
import { IGoal } from 'store/goals/types';

import style from './Goals.module.css';
import ModifyGoal from './ModifyGoal';
import UnsetGoal from './UnsetGoal';

interface IGoalItemProps {
  goal: IGoal;
}

const GoalItem: React.FC<IGoalItemProps> = ({ goal }) => {
  return (
    <div className={style['goal-item']}>
      <span className={style['actions']}>
        <ModifyGoal weekNumber={goal.weekNumber} pages={goal.pages} />
        <UnsetGoal weekNumber={goal.weekNumber} />
      </span>
      <Typography variant="info">{`Week ${goal.weekNumber}`}</Typography>
      <Typography variant="title">{goal.pages}</Typography>
      <Typography variant="caption">pages</Typography>
    </div>
  );
};

export default GoalItem;
