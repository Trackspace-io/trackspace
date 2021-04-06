import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import { useStudents } from 'controllers';
import React from 'react';

import style from './Home.module.css';

const Classrooms: React.FC = () => {
  const Students = useStudents();

  return (
    <div>
      <div className={style['classrooms-header']}>
        <Typography variant="subtitle"> My classrooms </Typography>
      </div>
      <Divider />
      <div className={style['classrooms-body']}>
        <Typography variant="info"> List of classrooms </Typography>
        <div className={style['classrooms-list']}>
          {Students.classroomsList.length !== 0 ? (
            Students.classroomsList.map((classroom) => (
              <div key={classroom.id} className={style['classroom-item']}>
                <a href={`/student/classrooms/${classroom.id}`}>{classroom.name}</a>
              </div>
            ))
          ) : (
            <Typography variant="caption" align="center">
              The list is empty.
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classrooms;
