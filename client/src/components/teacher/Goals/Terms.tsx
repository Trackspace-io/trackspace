import TermDropdown from 'components/common/TermDropdown';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import { dateString, today, WEEK_DAYS } from 'helpers/calendar';
import { useParams } from 'helpers/params';
import React from 'react';

import style from './Goals.module.css';

const Terms: React.FC = () => {
  // Retrieve classroom id
  const id = useParams();

  // Controllers
  const Classrooms = useClassroomsAsTeacher();

  // States
  const { terms } = Classrooms.current;

  return (
    <div className={style['terms-container']}>
      <div className={style['terms-header']}>
        <Typography variant="title" weight="light">
          Goals
        </Typography>
        <TermDropdown classroomId={id} />
      </div>
      <div className={style['terms-info']}>
        {terms.currentTerm && (
          <React.Fragment>
            <Typography variant="title" weight="light">
              {`Term ${terms.currentTerm.number}: ${dateString(terms.currentTerm.start)}
                  - ${dateString(terms.currentTerm.end)}`}
            </Typography>
            {terms.currentTerm.days?.map((day) => (
              <Typography
                key={day}
                variant="caption"
                display="inline"
                weight={WEEK_DAYS[today] === day ? 'bold' : 'light'}>
                {` ${day.slice(0, 3).toUpperCase()} `}
              </Typography>
            ))}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Terms;
