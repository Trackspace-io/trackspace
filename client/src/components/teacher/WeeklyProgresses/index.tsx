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
        {terms.currentTerm && (
          <StudentsSearchBar studentsList={students.list} setStudentId={(studentId) => setStudentId(studentId)} />
        )}
      </header>
      <main className={style['main']}>
        <Progresses classroomId={id} studentId={studentId} />
      </main>
    </div>
  );
};

export default WeeklyProgresses;
