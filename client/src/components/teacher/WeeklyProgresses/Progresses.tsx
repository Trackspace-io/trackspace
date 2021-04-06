import ProgressItem from 'components/common/ProgressItem/ProgressItem';
import Button from 'components/gui/Button';
import { useClassroomsAsTeacher } from 'controllers';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import ProgressGraph from './ProgressGraph';
import style from './WeeklyProgresses.module.css';

interface IProgressesProps {
  classroomId: string;
  studentId: string;
}

const Progresses: React.FC<IProgressesProps> = ({ classroomId, studentId }) => {
  // Controllers
  const Classrooms = useClassroomsAsTeacher(classroomId);

  const { terms, progresses } = Classrooms.current;
  const [weekNumber, setWeekNumber] = React.useState<number>(1);

  // Fetch the progress by week when the component mounts, on week, and on term changed.
  React.useEffect(() => {
    studentId &&
      terms.currentTerm?.id &&
      progresses.getByWeek({
        studentId,
        termId: terms.currentTerm?.id,
        weekNumber: weekNumber,
      });
  }, [studentId, terms.currentTerm?.id, weekNumber]);

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

  return (
    <div className={style['progresses-container']}>
      {studentId && (
        <React.Fragment>
          <ProgressGraph studentId={studentId} termId={String(terms.currentTerm?.id)} />
          <div className={style['progresses']}>
            <Button variant="secondary" onClick={handlePrevious} disabled={weekNumber === 1}>
              <FiChevronLeft />
            </Button>
            <ProgressItem week={progresses.byWeek} weekNumber={weekNumber} />
            <Button
              variant="secondary"
              onClick={handleNext}
              disabled={weekNumber >= Number(terms.currentTerm?.numberOfWeeks)}>
              <FiChevronRight />
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Progresses;
