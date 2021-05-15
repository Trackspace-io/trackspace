import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import React from 'react';
import { useParams } from 'react-router-dom';

import Progresses from './Progresses';
import StudentsSearchBar from './StudentsSearchBar';
import Terms from './Terms';
import style from './WeeklyProgresses.module.css';

interface RouteParams {
  id: string;
}

const WeeklyProgresses: React.FC = () => {
  // Retrieve id
  const { id } = useParams<RouteParams>();

  const Classrooms = useClassroomsAsTeacher(id);
  const { students, terms } = Classrooms.current;

  const [studentId, setStudentId] = React.useState<string>('');

  return (
    <div className={style['container']}>
      <header className={style['header']}>
        <Terms classroomId={id} />
      </header>
      <main className={style['main']}>
        {terms.currentTerm ? (
          <React.Fragment>
            <StudentsSearchBar studentsList={students.list} setStudentId={(studentId) => setStudentId(studentId)} />
            <Progresses classroomId={id} studentId={studentId} />
          </React.Fragment>
        ) : (
          <div className={style['progresses-empty']}>
            <Typography variant="subtitle">No term is associated to the current date.</Typography>
            <Typography variant="subtitle1"> Please add a term, or select a previous term.</Typography>
          </div>
        )}
      </main>
    </div>
  );
};

export default WeeklyProgresses;
