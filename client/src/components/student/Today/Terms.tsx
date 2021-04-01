import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent } from 'controllers';
import { dateString, today, WEEK_DAYS } from 'helpers/calendar';
import moment from 'moment';
import React from 'react';

interface ITermsProps {
  classroomId: string;
  selectedDate: moment.Moment;
}

const Terms: React.FC<ITermsProps> = ({ classroomId, selectedDate }) => {
  // Controllers
  const Classrooms = useClassroomsAsStudent(classroomId);

  //  States
  const { terms, progresses } = Classrooms;

  if (selectedDate <= moment(terms.selectedTerm?.start) || selectedDate >= moment(terms.selectedTerm?.end)) {
    return (
      <div>
        <Typography variant="subtitle" align="center">{`The selected date is outside of a term.`}</Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="subtitle1">
        {`Term ${progresses.byDate.termNumber} | Week ${progresses.byDate.weekNumber} | ${dateString(
          terms.selectedTerm?.start,
        )} - ${dateString(terms.selectedTerm?.end)}`}
      </Typography>
      {terms.selectedTerm?.days?.map((day) => (
        <Typography key={day} variant="caption" display="inline" weight={WEEK_DAYS[today] === day ? 'bold' : 'light'}>
          {` ${day.slice(0, 3).toUpperCase()} `}
        </Typography>
      ))}
    </div>
  );
};

export default Terms;
