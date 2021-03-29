import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useMenu, useUsers } from 'controllers';
import { dateString } from 'helpers/calendar';
import React from 'react';
import { useParams } from 'react-router-dom';
import Progress from './Progress';
import Terms from './Terms';

import style from './Today.module.css';

interface RouteParams {
  id: string;
}

const Today: React.FC = () => {
  // Retrieve id
  const { id } = useParams<RouteParams>();

  const Classrooms = useClassroomsAsStudent(id);
  const Users = useUsers();
  const Menu = useMenu();

  const { progresses } = Classrooms;

  React.useEffect(() => {
    Users.current.id &&
      progresses.getByDate({
        classroomId: id,
        studentId: Users.current.id,
        date: Menu.date.format('YYYY/MM/DD'),
      });
  }, [Users.current.id]);

  if (Object.entries(progresses.byDate).length === 0) {
    return (
      <div className={style['container']}>
        <Typography variant="subtitle" align="center">{`There's no class today.`}</Typography>
      </div>
    );
  }

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <Typography variant="title" weight="light">
          {dateString(Menu.date.toLocaleString())}
        </Typography>
        <br />
        <div>
          <Terms classroomId={id} />
          <Progress classroomId={id} />
        </div>
      </div>
    </div>
  );
};

export default Today;
