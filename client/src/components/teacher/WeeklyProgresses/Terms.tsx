import { Dropdown, DropdownItem } from 'components/gui/Dropdown';
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
  const { terms } = Classrooms;

  const handleClick = (termId: string) => {
    terms.getById({
      classroomId,
      id: termId,
    });
  };

  return (
    <div className={style['terms-container']}>
      <div className={style['terms']}>
        {terms.currentTerm ? (
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
        ) : (
          <React.Fragment>
            <Typography variant="title" weight="light">
              Weekly progress
            </Typography>
            <br />
            <Typography variant="subtitle1">No term is associated to the current date.</Typography>
            <Typography variant="subtitle1"> Please add a term, or select a previous term.</Typography>
          </React.Fragment>
        )}
      </div>
      {terms.list.length !== 0 && (
        <div className={style['terms-dropdown']}>
          <Dropdown type="title" title="Select term">
            {terms.list.map((term, i) => (
              <DropdownItem key={term.id} type="button" onClick={handleClick.bind(this, term.id)}>
                <Typography variant="caption">
                  {`Term ${i + 1}: ${dateString(term.start)} - ${dateString(term.end)}`}
                </Typography>
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default Terms;