import Button from 'components/gui/Button';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useUsers } from 'controllers';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import ProgressGraph from './ProgressGraph';
import ProgressItem from '../../common/ProgressItem/ProgressItem';
import style from './Weekly.module.css';

interface IProgressesProps {
  classroomId: string;
}

const Progresses: React.FC<IProgressesProps> = ({ classroomId }) => {
  const Classrooms = useClassroomsAsStudent(classroomId);
  const Users = useUsers();

  const { terms, progresses } = Classrooms;

  const [weekNumber, setWeekNumber] = React.useState<number>(1);

  // Fetch the progress by week when the component mounts, on week, and on term changed.
  React.useEffect(() => {
    Users.current.id &&
      terms.currentTerm?.id &&
      progresses.getByWeek({
        studentId: Users.current.id,
        termId: String(terms.currentTerm?.id),
        weekNumber: weekNumber,
      });
  }, [Users.current.id, terms.currentTerm?.id, weekNumber]);

  // Previous week onClick handler
  const handlePrevious = () => {
    if (weekNumber > 1) {
      setWeekNumber(weekNumber - 1);
    }
  };

  // Next week onClick handler
  const handleNext = () => {
    const numberOfWeeks = terms.currentTerm?.numberOfWeeks;

    if (weekNumber < Number(numberOfWeeks)) {
      setWeekNumber(weekNumber + 1);
    }
  };

  if (!terms.currentTerm) {
    return (
      <div className={style['progresses-empty']}>
        <Typography variant="subtitle">No term is associated to the current date.</Typography>
        <Typography variant="subtitle1"> Please add a term, or select a previous term.</Typography>
      </div>
    );
  }

  return (
    <div className={style['progresses-container']}>
      <ProgressGraph studentId={Users.current?.id} termId={terms.currentTerm?.id} />
      <div className={style['progresses']}>
        <Button variant="secondary" onClick={handlePrevious} disabled={weekNumber === 1}>
          <FiChevronLeft className={style['btn-left']} />
        </Button>
        <ProgressItem week={progresses.byWeek} weekNumber={weekNumber} />
        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={weekNumber >= Number(terms.currentTerm?.numberOfWeeks)}>
          <FiChevronRight className={style['btn-right']} />
        </Button>
      </div>
    </div>
  );
};
export default Progresses;
