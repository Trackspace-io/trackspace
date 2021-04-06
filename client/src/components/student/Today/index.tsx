import Tooltip from 'components/gui/Tooltip';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useMenu, useUsers } from 'controllers';
import { dateString } from 'helpers/calendar';
import React from 'react';
import { FcInfo } from 'react-icons/fc';
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

  const { progresses, terms } = Classrooms;

  // Fetch the progress by date when the components mounts, and when a date is selected from the menu.
  React.useEffect(() => {
    progresses.getByDate({
      classroomId: id,
      studentId: Users.current.id,
      date: Menu.date.format('YYYY-MM-DD'),
    });

    terms
      .getByDate({
        classroomId: id,
        date: Menu.date.format('YYYY-MM-DD'),
      })
      .then((data) => {
        terms.setSelectedTerm(data);
      });
  }, [Users.current.id, Menu.date]);

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <div>
          <Typography variant="title" weight="light">
            {dateString(Menu.date.toLocaleString())}
          </Typography>
          <br />
          <Terms classroomId={id} selectedDate={Menu.date} />
        </div>
        <div className={style['helper']}>
          <Tooltip text="Select a date from the calendar on the right." position="left">
            <FcInfo />
          </Tooltip>
        </div>
      </div>
      <div className={style['body']}>
        <Progress classroomId={id} selectedDate={Menu.date} />
      </div>
    </div>
  );
};

export default Today;
