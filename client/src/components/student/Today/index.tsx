import DailyProgress from 'components/common/DailyProgress';
import Tooltip from 'components/gui/Tooltip';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useMenu, useUsers } from 'controllers';
import { dateString } from 'helpers/calendar';
import React from 'react';
import { useParams } from 'react-router-dom';

import Terms from './Terms';
import style from './Today.module.css';

interface RouteParams {
  classroomId: string;
}

const Today: React.FC = () => {
  // Retrieve id
  const { classroomId } = useParams<RouteParams>();

  const Classrooms = useClassroomsAsStudent(classroomId);
  const Users = useUsers();
  const Menu = useMenu();

  const { progresses, terms } = Classrooms;

  // Fetch the progress by date when the components mounts, and when a date is selected from the menu.
  React.useEffect(() => {
    Users.current.id &&
      progresses.getByDate({
        classroomId,
        studentId: Users.current.id,
        date: Menu.date.format('YYYY-MM-DD'),
      });

    terms
      .getByDate({
        classroomId,
        date: Menu.date.format('YYYY-MM-DD'),
      })
      .then((data) => {
        terms.setSelectedTerm(data);
      });
  }, [Users.current.id, Menu.date]);

  return (
    <div className={style['container']}>
      <header className={style['header']}>
        <Typography variant="title" align="center" weight="light">
          {`${dateString(Menu.date.toLocaleString())}`}
        </Typography>
        <Terms classroomId={classroomId} selectedDate={Menu.date} />
      </header>
      <section className={style['progress-grid']}>
        <div className={style['progress-header']}>
          <Typography></Typography>
          <Tooltip text="I would like to start from page X" position="top">
            <Typography variant="subtitle1">Start page</Typography>
          </Tooltip>
          <Tooltip text="I would like to do X pages" position="top">
            <Typography variant="subtitle1">Page set</Typography>
          </Tooltip>
          <Tooltip text="I did X number of pages" position="top">
            <Typography variant="subtitle1">Got to</Typography>
          </Tooltip>
          <Tooltip text="Number of pages left" position="top">
            <Typography variant="subtitle1">Homework</Typography>
          </Tooltip>
          <Typography variant="subtitle1">Done</Typography>
        </div>
        <div className={style['progress-content']}>
          {Object.keys(progresses.byDate).length !== 0 ? (
            progresses.byDate.subjects?.map((progress) => (
              <DailyProgress key={progress.subject.id} progress={progress} setOrUpdate={progresses.setOrUpdate} />
            ))
          ) : (
            <Typography align="center">There are no courses on this date</Typography>
          )}
        </div>
      </section>
    </div>
  );
};

export default Today;
