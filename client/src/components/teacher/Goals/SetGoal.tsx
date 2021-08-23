import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import { Select, useSelect } from 'components/gui/Select';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

import style from './Goals.module.css';

const SetGoal: React.FC<{
  classroomId: string;
  isOpen: boolean;
  onClose: () => void;
  weeks: number[];
  pages?: number;
}> = ({ classroomId, isOpen, onClose, weeks, pages }) => {
  // Controllers
  const Classrooms = useClassroomsAsTeacher();
  const Inputs = useInput({ pages: 0 });
  const Selects = useSelect({ weekNumber: weeks[0] });

  // States
  const { goals, terms } = Classrooms.current;

  React.useEffect(() => {
    pages &&
      Inputs.setValues({
        ...Inputs.values,
        pages,
      });
  }, []);

  // Handle form submit
  const handleSubmit = () => {
    const payload = {
      classroomId,
      termId: String(terms.currentTerm?.id),
      weekNumber: Selects.values.weekNumber,
      pages: Inputs.values.pages,
    };

    goals.set(payload).then(() => {
      onClose();
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={style['goal-set']}>
        <div className={style['goal-set-header']}>
          <Typography variant="subtitle" weight="light">
            Add a goal for week
          </Typography>
          <Select
            name="weekNumber"
            options={weeks}
            value={Selects.values.weekNumber}
            onChange={Selects.handleSelectChange}
            align="center"
          />
        </div>
        <div className={style['goal-set-body']}>
          <Input
            name="pages"
            type="number"
            label="Pages"
            value={Inputs.values.pages}
            onChange={Inputs.handleInputChange}
          />
        </div>
        <div className={style['goal-set-footer']}>
          <FiX onClick={onClose} />
          <FiCheck onClick={handleSubmit} />
        </div>
      </div>
    </Modal>
  );
};

export default SetGoal;
