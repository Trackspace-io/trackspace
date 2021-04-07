import { Dropdown, DropdownItem } from 'components/gui/Dropdown';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import { dateString, today, WEEK_DAYS } from 'helpers/calendar';
import { useParams } from 'helpers/params';
import React from 'react';
import style from './Goals.module.css';

const Terms: React.FC = () => {
  // Retrieve classroom id
  const id = useParams();

  const Classrooms = useClassroomsAsTeacher();

  const { terms } = Classrooms.current;

  const handleClick = (termId: string) => {
    terms.getById({
      classroomId: id,
      id: termId,
    });
  };

  return (
    <div className={style['terms-container']}>
      <div className={style['terms']}>
        <Typography variant="title" weight="light">
          {terms.currentTerm &&
            `${dateString(terms.currentTerm.start)}
              - ${dateString(terms.currentTerm.end)}`}
        </Typography>
        {terms.currentTerm?.days?.map((day) => (
          <Typography key={day} variant="caption" display="inline" weight={WEEK_DAYS[today] === day ? 'bold' : 'light'}>
            {` ${day.slice(0, 3).toUpperCase()} `}
          </Typography>
        ))}
      </div>
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
    </div>
  );
};

export default Terms;
