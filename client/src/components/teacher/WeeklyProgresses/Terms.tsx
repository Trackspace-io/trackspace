import TermDropdown from 'components/common/TermDropdown';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent } from 'controllers';
import { dateString, today, WEEK_DAYS } from 'helpers/calendar';
import React from 'react';

import style from './WeeklyProgresses.module.css';

interface ITermsProps {
  classroomId: string;
}

const Terms: React.FC<ITermsProps> = ({ classroomId }) => {
  // Controllers.
  const Classrooms = useClassroomsAsStudent(classroomId);

  // States.
  const { terms } = Classrooms;

  return (
    <div className={style['terms-container']}>
      <div className={style['terms-header']}>
        <Typography variant="title" weight="light">
          Weekly progresses
        </Typography>
        <TermDropdown classroomId={classroomId} />
      </div>
      {terms.currentTerm && (
        <div className={style['terms-info']}>
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
        </div>
      )}
    </div>
  );
};

export default Terms;
