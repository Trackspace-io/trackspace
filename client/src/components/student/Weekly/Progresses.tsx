import Button from 'components/gui/Button';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useUsers } from 'controllers';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Graph from './Graph';

import ProgressItem from './ProgressItem';
import style from './Weekly.module.css';

interface IProgressesProps {
  classroomId: string;
}

const Progresses: React.FC<IProgressesProps> = ({ classroomId }) => {
  const Classrooms = useClassroomsAsStudent(classroomId);
  const Users = useUsers();

  const { terms, progresses } = Classrooms;

  const [weekNumber, setWeekNumber] = React.useState<number>(1);

  React.useEffect(() => {
    Users.current.id &&
      progresses.getByWeek({
        studentId: Users.current.id,
        termId: String(terms.currentTerm?.id),
        weekNumber: weekNumber,
      });
  }, [Users.current.id]);

  React.useEffect(() => {
    progresses.getByWeek({
      studentId: Users.current.id,
      termId: String(terms.currentTerm?.id),
      weekNumber: weekNumber,
    });
  }, [weekNumber]);

  React.useEffect(() => {
    terms.currentTerm?.id &&
      progresses.getByWeek({
        studentId: Users.current.id,
        termId: String(terms.currentTerm?.id),
        weekNumber: weekNumber,
      });
  }, [terms.currentTerm?.id]);

  const handlePrevious = () => {
    if (weekNumber > 1) {
      setWeekNumber(weekNumber - 1);
    }
  };

  const handleNext = () => {
    const numberOfWeeks = terms.currentTerm?.numberOfWeeks;

    if (weekNumber < Number(numberOfWeeks)) {
      setWeekNumber(weekNumber + 1);
    }
  };

  if (!terms.currentTerm) {
    return (
      <div className={style['container']}>
        <Typography variant="subtitle" align="center">{`There's no class this week.`}</Typography>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className={style['graph-container']}>
        <Graph studentId={Users.current && Users.current.id} termId={terms.currentTerm?.id} />
      </div>
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
  );
};
export default Progresses;
