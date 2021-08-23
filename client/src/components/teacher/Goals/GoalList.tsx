import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { IGoal } from 'store/goals/types';

import GoalItem from './GoalItem';
import style from './Goals.module.css';
import SetGoal from './SetGoal';

const GoalList: React.FC<{
  classroomId: string;
  list: IGoal[];
  numberOfWeeks: number;
}> = ({ classroomId, list, numberOfWeeks }) => {
  // States
  const [modal, setModal] = React.useState<boolean>(false);
  const [weeks, setWeeks] = React.useState<number[]>([]);

  const handleClick = (weeks: number[]) => {
    setWeeks(weeks);
    setModal(true);
  };

  /**
   * Render if the list of goals is empty.
   *
   * @returns JSX element
   */
  const renderIfEmpty = () => {
    if (list.length !== 0) {
      return;
    }

    const weeks = [];

    for (let i = 1; i <= numberOfWeeks; i++) {
      weeks.push(i);
    }

    return <FiPlus className={style['goal-set-button']} onClick={handleClick.bind(this, weeks)} />;
  };

  /**
   * Render the 'add' previous week's goal if necessary.
   *
   * @param {Number}  index Index of the goal item.
   * @param {IGoal}   goal  The goal element.
   *
   * @returns JSX element
   */
  const setPreviousTrigger = (index: number, goal: IGoal) => {
    const firstAndNotEmpty = index === 0 && goal.prevWeeks.length !== 0;

    return firstAndNotEmpty ? (
      <FiPlus className={style['goal-set-button']} onClick={handleClick.bind(this, goal.prevWeeks)} />
    ) : (
      <div />
    );
  };

  /**
   *
   * @param {IGoal} goal  The goal element.
   *
   * @returns JSX element
   */
  const setNextTrigger = (goal: IGoal) => {
    const isNotEmpty = goal.nextWeeks.length !== 0;

    return isNotEmpty ? (
      <FiPlus className={style['goal-set-button']} onClick={handleClick.bind(this, goal.nextWeeks)} />
    ) : (
      goal.weekNumber !== numberOfWeeks && <hr className={style['linked']}></hr>
    );
  };

  return (
    <div className={style['goal-list']}>
      {list.map((goal, i) => (
        <React.Fragment key={i}>
          {setPreviousTrigger(i, goal)}
          <GoalItem classroomId={classroomId} goal={goal} />
          {setNextTrigger(goal)}
        </React.Fragment>
      ))}
      {modal && <SetGoal classroomId={classroomId} isOpen={modal} onClose={() => setModal(false)} weeks={weeks} />}
      {renderIfEmpty()}
    </div>
  );
};

export default GoalList;
