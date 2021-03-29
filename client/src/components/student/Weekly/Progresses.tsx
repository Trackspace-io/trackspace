import { useClassroomsAsStudent, useUsers } from 'controllers';
import React from 'react';

import ProgressItem from './ProgressItem';

interface IProgressesProps {
  classroomId: string;
}

const Progresses: React.FC<IProgressesProps> = ({ classroomId }) => {
  const Classrooms = useClassroomsAsStudent(classroomId);
  const Users = useUsers();

  const { terms, progresses } = Classrooms;

  React.useEffect(() => {
    const numberOfWeeks = Number(terms.currentTerm && terms.currentTerm.numberOfWeeks);

    for (let i = 0; i <= numberOfWeeks - 1; i++) {
      progresses.getByWeek({
        studentId: Users.current.id,
        termId: String(terms.currentTerm.id),
        weekNumber: i + 1,
      });
    }
  }, [terms.currentTerm.id]);

  return (
    <React.Fragment>
      <div>
        {progresses.byWeek.map((week, i) => {
          return <ProgressItem key={i} index={i} week={week} />;
        })}
      </div>
    </React.Fragment>
  );
};
export default Progresses;
