import Button from 'components/gui/Button';
import Checkbox from 'components/gui/Checkbox';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import * as React from 'react';
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi';
import { ITerm, ITermCreate, ITermModify, ITermRemove } from 'store/terms/types';

import { dateValue, today, WEEK_DAYS } from '../../helpers/calendar';
import style from '../../styles/teacher/Terms.module.css';

const Terms: React.FC<{
  classroomId: string;
}> = ({ classroomId }) => {
  // Controllers
  const Classrooms = useClassroomsAsTeacher(classroomId);

  const {
    current: { terms },
  } = Classrooms;

  // Internal hooks
  const [action, setAction] = React.useState('');
  const [term, setTerm] = React.useState<ITerm | undefined>(undefined);

  return (
    <div>
      <div className={style['header']}>
        <Typography variant="title" weight="light">
          Manage terms
        </Typography>
        <Button variant="primary" onClick={() => setAction('create')}>
          <FiPlus />
        </Button>
      </div>
      <div className={style['body']}>
        <div className={style['list']}>
          {terms.list.length !== 0 ? (
            terms.list.map((term, i) => (
              <TermItem key={term.id} term={term} index={i} setAction={setAction} setTerm={setTerm} />
            ))
          ) : (
            <div className={style['list-empty']}>
              <Typography variant="caption" align="center">
                The list is empty.
              </Typography>
            </div>
          )}
        </div>
      </div>

      {action === 'create' && (
        <AddTerm
          isOpen={Boolean(action === 'create')}
          onClose={() => setAction('')}
          classroomId={classroomId}
          addTerm={terms.create}
        />
      )}

      {action === 'modify' && (
        <ModifyTerm
          isOpen={Boolean(action === 'modify')}
          onClose={() => setAction('')}
          term={term}
          classroomId={classroomId}
          modifyTerm={terms.modify}
        />
      )}

      {action === 'remove' && (
        <RemoveTerm
          isOpen={Boolean(action === 'remove')}
          onClose={() => setAction('')}
          term={term}
          classroomId={classroomId}
          removeTerm={terms.remove}
        />
      )}
    </div>
  );
};

interface ITermItem {
  term: ITerm;
  index: number;
  setAction: React.Dispatch<React.SetStateAction<string>>;
  setTerm: React.Dispatch<React.SetStateAction<ITerm | undefined>>;
}

const TermItem: React.FC<ITermItem> = ({ term, index, setAction, setTerm }) => {
  return (
    <div key={term.id} className={style['item']}>
      <div>
        <Typography display="inline">Term {index + 1} </Typography>
        <Typography variant="caption" display="inline">
          {` | `}
        </Typography>
        {term.days.map((day: string) => {
          return (
            <Typography
              key={day}
              variant="caption"
              display="inline"
              weight={WEEK_DAYS[today] === day ? 'bold' : 'light'}>
              {` ${day.slice(0, 3)} `}
            </Typography>
          );
        })}
        <Typography variant="caption">
          {dateValue(term.start)} - {dateValue(term.end)}
        </Typography>
      </div>
      <div className={style['actions']}>
        <FiEdit2
          onClick={() => {
            setAction('modify');
            setTerm(term);
          }}
        />
        <FiTrash
          onClick={() => {
            setAction('remove');
            setTerm(term);
          }}
        />
      </div>
    </div>
  );
};

interface IAddTermProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
  addTerm: (payload: ITermCreate) => Promise<any>;
}

const AddTerm: React.FC<IAddTermProps> = ({ isOpen, onClose, classroomId, addTerm }) => {
  const Inputs = useInput({
    start: '',
    end: '',
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { start, end } = Inputs.values;

    const days = Object.keys(Inputs.values).reduce<string[]>((acc, day) => {
      if (WEEK_DAYS.includes(day) && Inputs.values[day]) {
        acc = [...acc, day];
      }

      return acc;
    }, []);

    addTerm({
      start,
      end,
      days,
      classroomId,
    }).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle" weight="light">
          Create a term.
        </Typography>
        <br />
        <Form
          action="Add"
          handleSubmit={handleSubmit}
          render={() => (
            <React.Fragment>
              <Input
                name="start"
                type="date"
                label="Start date"
                value={dateValue(Inputs.values.start)}
                onChange={Inputs.handleInputChange}
              />
              <Input
                name="end"
                type="date"
                label="End date"
                value={dateValue(Inputs.values.end)}
                onChange={Inputs.handleInputChange}
              />
              <br />
              <div className={style['checkboxes']}>
                {WEEK_DAYS.map((day) => {
                  return (
                    <Checkbox
                      key={day}
                      name={day}
                      label={day.slice(0, 3).toUpperCase()}
                      checked={Inputs.values[day]}
                      onChange={(e) =>
                        Inputs.setValues({
                          ...Inputs.values,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  );
                })}
              </div>
            </React.Fragment>
          )}
        />
      </Modal>
    </div>
  );
};

interface IModifyTermProps {
  isOpen: boolean;
  onClose: () => void;
  term: ITerm | undefined;
  classroomId: string;
  modifyTerm: (input: ITermModify) => Promise<any>;
}

const ModifyTerm: React.FC<IModifyTermProps> = ({ isOpen, onClose, classroomId, term, modifyTerm }) => {
  const Inputs = useInput({
    start: '',
    end: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const isDayInclude = (day: string) => {
    return term?.days.includes(day);
  };

  React.useEffect(() => {
    term &&
      Inputs.setValues({
        ...Inputs.values,
        start: term.start,
        end: term.end,
        sunday: isDayInclude('sunday'),
        monday: isDayInclude('monday'),
        tuesday: isDayInclude('tuesday'),
        wednesday: isDayInclude('wednesday'),
        thursday: isDayInclude('thursday'),
        friday: isDayInclude('friday'),
        saturday: isDayInclude('saturday'),
      });
  }, [term]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { start, end } = Inputs.values;

    const days = Object.keys(Inputs.values).reduce<string[]>((acc, day) => {
      if (WEEK_DAYS.includes(day) && Inputs.values[day]) {
        acc = [...acc, day];
      }

      return acc;
    }, []);

    modifyTerm({
      id: String(term?.id),
      start,
      end,
      days,
      classroomId,
    }).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle" weight="light">
          Update the following term.
        </Typography>
        <br />
        <Form
          action="Modify"
          handleSubmit={handleSubmit}
          render={() => (
            <React.Fragment>
              <Input
                name="start"
                type="date"
                label="Start date"
                value={dateValue(Inputs.values.start)}
                onChange={Inputs.handleInputChange}
              />
              <Input
                name="end"
                type="date"
                label="End date"
                value={dateValue(Inputs.values.end)}
                onChange={Inputs.handleInputChange}
              />
              <br />
              <div className={style['checkboxes']}>
                {WEEK_DAYS.map((day) => {
                  return (
                    <Checkbox
                      key={day}
                      name={day}
                      label={day.slice(0, 3).toUpperCase()}
                      checked={Inputs.values[day]}
                      onChange={(e) =>
                        Inputs.setValues({
                          ...Inputs.values,
                          [e.target.name]: e.target.checked,
                        })
                      }
                    />
                  );
                })}
              </div>
            </React.Fragment>
          )}
        />
      </Modal>
    </div>
  );
};

interface IRemoveSubjectProps {
  isOpen: boolean;
  onClose: () => void;
  term: ITerm | undefined;
  classroomId: string;
  removeTerm: (payload: ITermRemove) => Promise<any>;
}

const RemoveTerm: React.FC<IRemoveSubjectProps> = ({ isOpen, onClose, classroomId, term, removeTerm }) => {
  const handleSubmit = () => {
    const payload = {
      classroomId,
      id: String(term?.id),
    };

    removeTerm(payload).then(() => {
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle" weight="light">
          Would you like to remove the following term ?
        </Typography>
        <br />
        <div className={style['remove-actions']}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Terms;
