import Typography from 'components/gui/Typography';
import { useStudents } from 'controllers';
import React from 'react';
import { Link } from 'react-router-dom';

import style from './Home.module.css';

const Classrooms: React.FC = () => {
  const Students = useStudents();

  return (
    <div>
      <header className={style['classrooms-header']}>
        <Typography variant="title" weight="light">
          Classrooms
        </Typography>
      </header>
      <main className={style['classrooms-list']}>
        {Students.classroomsList.length !== 0 ? (
          Students.classroomsList.map((classroom) => (
            <div key={classroom.id} className={style['classroom-item']}>
              <Link to={`/student/classrooms/${classroom.id}`}>{classroom.name}</Link>
            </div>
          ))
        ) : (
          <Typography variant="caption" align="center">
            The list is empty.
          </Typography>
        )}
      </main>
    </div>
  );
};

export default Classrooms;
