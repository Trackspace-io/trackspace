import Button from 'components/gui/Button';
import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import useClassrooms from 'controllers/useClassrooms';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from '../../styles/teacher/Terms.module.css';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Form from 'components/gui/Form';
import { IAddTerm } from 'types';
import Checkbox from 'components/gui/Checkbox';

interface RouteParams {
  id: string;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const Terms: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const Classrooms = useClassrooms(id);

  // Internal hooks
  const [action, setAction] = React.useState('');

  return (
    <div>
      <div className={style['header']}>
        <Typography variant="subtitle"> Manage terms </Typography>
        <Button variant="primary" onClick={() => setAction('add')}>
          Add term
        </Button>
      </div>
      <Divider />
      <div className={style['body']}>
        <Typography variant="info"> List of terms </Typography>
        <div className={style['list']}>
          {Classrooms.termsList.length !== 0 ? (
            Classrooms.termsList.map((term, i) => (
              <div key={term.id} className={style['item']}>
                <div>
                  <Typography display="inline">Term {i + 1} </Typography>
                  <Typography variant="caption" display="inline">
                    {' | '}
                    {term.days.map((day) => {
                      return day[0].toUpperCase();
                    })}
                  </Typography>
                  <Typography variant="caption">
                    {new Date(term.start).toLocaleDateString()} - {new Date(term.end).toLocaleDateString()}
                  </Typography>
                </div>
                <div className={style['actions']}>
                  <FontAwesomeIcon
                    icon={faEdit}
                    // onClick={() => {
                    //   setAction('edit');
                    //   setSubject(subject);
                    // }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    // onClick={() => {
                    //   setAction('remove');
                    //   setSubject(subject);
                    // }}
                  />
                </div>
              </div>
            ))
          ) : (
            <Typography variant="caption" align="center">
              The list is empty.
            </Typography>
          )}
        </div>
      </div>

      {action === 'add' && (
        <AddTerm
          isOpen={Boolean(action === 'add')}
          onClose={() => setAction('')}
          classroomId={id}
          addTerm={Classrooms.addTerm}
        />
      )}
    </div>
  );
};

interface IAddTermProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
  addTerm: (payload: IAddTerm) => Promise<any>;
}

const AddTerm: React.FC<IAddTermProps> = ({ isOpen, onClose, classroomId, addTerm }) => {
  const Inputs = useInput({
    start: new Date(),
    end: new Date(),
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
      if (DAYS.includes(day) && Inputs.values[day]) {
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
        <Typography variant="info"> Create a term. </Typography>
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
                value={Inputs.values.start}
                onChange={Inputs.handleInputChange}
              />
              <Input
                name="end"
                type="date"
                label="End date"
                value={Inputs.values.end}
                onChange={Inputs.handleInputChange}
              />
              <div className={style['checkboxes']}>
                {DAYS.map((day) => {
                  return (
                    <Checkbox
                      key={day}
                      name={day}
                      label={day.toUpperCase()}
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

export default Terms;
