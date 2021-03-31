import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent } from 'controllers';
import { dateString, today, WEEK_DAYS } from 'helpers/calendar';
import React from 'react';

interface ITermsProps {
  classroomId: string;
}

const Terms: React.FC<ITermsProps> = ({ classroomId }) => {
  // Controllers
  const Classrooms = useClassroomsAsStudent(classroomId);

  //  States
  const { terms, progresses } = Classrooms;

  React.useEffect(() => {
    const termNumber = progresses.byDate.termNumber;

    const term = terms.list[Number(termNumber) - 1];

    terms.getById({
      classroomId,
      id: term.id,
    });
  }, [progresses.byDate.termNumber]);

  return (
    <React.Fragment>
      <Typography variant="subtitle1">
        {`Term ${progresses.byDate.termNumber} | Week ${progresses.byDate.weekNumber} | ${dateString(
          terms.currentTerm?.start,
        )} - ${dateString(terms.currentTerm?.end)}`}
      </Typography>
      {terms.currentTerm?.days?.map((day) => (
        <Typography key={day} variant="caption" display="inline" weight={WEEK_DAYS[today] === day ? 'bold' : 'light'}>
          {` ${day.slice(0, 3).toUpperCase()} `}
        </Typography>
      ))}
      <br />
      <br />
    </React.Fragment>
  );
};

export default Terms;
