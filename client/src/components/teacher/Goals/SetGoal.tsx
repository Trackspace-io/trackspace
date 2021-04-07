import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import { useClassroomsAsTeacher } from 'controllers';
import { useParams } from 'helpers/params';
import React from 'react';

const SetGoal: React.FC = () => {
  // Retrieve classroom id
  const id = useParams();

  // Controllers
  const Classrooms = useClassroomsAsTeacher();
  const Inputs = useInput({ pages: 0 });

  // States
  const { goals, terms } = Classrooms.current;

  // Handle form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      classroomId: id,
      termId: String(terms.currentTerm?.id),
      weekNumber: 2,
      pages: Inputs.values.pages,
    };

    goals.set(payload);
  };

  return (
    <div>
      <Form
        action="Submit"
        handleSubmit={handleSubmit}
        render={() => (
          <Input
            name="pages"
            type="number"
            label="Pages"
            value={Inputs.values.pages}
            onChange={Inputs.handleInputChange}
          />
        )}
      />
    </div>
  );
};

export default SetGoal;
