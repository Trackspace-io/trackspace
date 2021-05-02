import Tooltip from 'components/gui/Tooltip';
import Typography from 'components/gui/Typography';
import { useClassroomsAsParent, useMenu } from 'controllers';
import { dateString } from 'helpers/calendar';
import React from 'react';
import { useParams } from 'react-router';
import Progress from './Progress';
import style from './Today.module.css';

interface RouteParams {
  classroomId: string;
  studentId: string;
}

const Today: React.FC = () => {
  // Retrieve url ids
  const { classroomId, studentId } = useParams<RouteParams>();

  // Controllers
  const Menu = useMenu();
  const Classrooms = useClassroomsAsParent(classroomId);

  // States
  const { progresses, terms } = Classrooms;

  React.useEffect(() => {
    progresses.getByDate({
      date: Menu.date.format('YYYY-MM-DD'),
      classroomId,
      studentId,
    });

    terms
      .getByDate({
        classroomId,
        date: Menu.date.format('YYYY-MM-DD'),
      })
      .then((data) => {
        terms.setSelectedTerm(data);
      });
  }, [Menu.date]);

  return (
    <div className={style['container']}>
      <header>
        <Typography variant="title" align="center" weight="light">
          {`${dateString(Menu.date.toLocaleString())}`}
        </Typography>
        {terms.selectedTerm && (
          <Typography variant="subtitle1" align="center" weight="light">
            {`Term ${terms.selectedTerm?.number} - Week ${terms.selectedTerm?.currentWeek}`}
          </Typography>
        )}
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
              <Progress key={progress.subject.id} progress={progress} setOrUpdate={progresses.setOrUpdate} />
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
