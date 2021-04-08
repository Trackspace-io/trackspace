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
  const { students } = Classrooms.current;

  const [studentId, setStudentId] = React.useState<string>('');

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Terms classroomId={id} />
        <StudentsSearchBar studentsList={students.list} setStudentId={(studentId) => setStudentId(studentId)} />
      </div>
      <div className={style['body']}>
        <Progresses classroomId={id} studentId={studentId} />
      </div>
    </div>
  );
};

export default WeeklyProgresses;
