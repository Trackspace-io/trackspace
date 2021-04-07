import React from 'react';
import { IGoal } from 'store/goals/types';
import GoalItem from './GoalItem';

import style from './Goals.module.css';

interface IGoalListProps {
  list: IGoal[];
}

const GoalList: React.FC<IGoalListProps> = ({ list }) => {
  return (
    <div className={style['goal-list']}>
      {list.map((goal, i) => (
        <GoalItem key={i} goal={goal} />
      ))}
    </div>
  );
};

export default GoalList;
