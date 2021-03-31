import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useUsers } from 'controllers';
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProgressItem from './ProgressItem';
import style from './Weekly.module.css';

interface IProgressesProps {
  classroomId: string;
}

const Progresses: React.FC<IProgressesProps> = ({ classroomId }) => {
  const Classrooms = useClassroomsAsStudent(classroomId);
  const Users = useUsers();

  const { terms, progresses } = Classrooms;

  React.useEffect(() => {
    Users.current.id &&
      progresses.getByWeek({
        studentId: Users.current.id,
        termId: String(terms.currentTerm?.id),
        weekNumber: 3,
      });
  }, [terms.currentTerm && terms.currentTerm.id]);

  if (!terms.currentTerm) {
    return (
      <div className={style['container']}>
        <Typography variant="subtitle" align="center">{`There's no class this week.`}</Typography>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className={style['progresses-container']}>
        <FiChevronLeft />
        <ProgressItem week={progresses.byWeek} />
        <FiChevronRight />
      </div>
    </React.Fragment>
  );
};
export default Progresses;
