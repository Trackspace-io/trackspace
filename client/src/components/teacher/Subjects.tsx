import Button from 'components/gui/Button';
import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import * as React from 'react';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { ISubject, ISubjectAdd, ISubjectModify, ISubjectRemove } from 'store/subjects/types';

import style from '../../styles/teacher/Subjects.module.css';

interface RouteParams {
  id: string;
}

const Subjects: React.FC = () => {
  const { id } = useParams<RouteParams>();

  // Controllers
  const Classrooms = useClassroomsAsTeacher(id);

  const { subjects } = Classrooms.current;

  // Internal hooks
  const [action, setAction] = React.useState('');
  const [subject, setSubject] = React.useState<ISubject | undefined>(undefined);

  return (
    <div>
      <div className={style['header']}>
        <Typography variant="subtitle"> Manage subjects </Typography>
        <Button variant="primary" onClick={() => setAction('add')}>
          Add subject
        </Button>
      </div>
      <Divider />
      <div className={style['body']}>
        <Typography variant="info"> List of students </Typography>
        <div className={style['list']}>
          {subjects.list.length !== 0 ? (
            subjects.list.map((subject) => (
              <div key={subject.id} className={style['item']}>
                <div>
                  <Typography>{subject.name}</Typography>
                </div>
                <div className={style['actions']}>
                  <FiEdit2
                    onClick={() => {
                      setAction('modify');
                      setSubject(subject);
                    }}
                  />
                  <FiTrash
                    onClick={() => {
                      setAction('remove');
                      setSubject(subject);
                    }}
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
        <AddSubject
          isOpen={Boolean(action === 'add')}
          onClose={() => setAction('')}
          classroomId={id}
          addSubject={subjects.add}
        />
      )}

      {action === 'modify' && (
        <EditSubject
          isOpen={Boolean(action === 'modify')}
          onClose={() => setAction('')}
          subject={subject}
          classroomId={id}
          editSubject={subjects.modify}
        />
      )}

      {action === 'remove' && (
        <RemoveSubject
          isOpen={Boolean(action === 'remove')}
          onClose={() => setAction('')}
          subject={subject}
          classroomId={id}
          removeSubject={subjects.remove}
        />
      )}
    </div>
  );
};

interface IAddSubjectProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
  addSubject: (input: ISubjectAdd) => Promise<any>;
}

const AddSubject: React.FC<IAddSubjectProps> = ({ isOpen, onClose, classroomId, addSubject }) => {
  const Inputs = useInput({ name: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addSubject({ ...Inputs.values, classroomId }).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info"> Add a subject. </Typography>
        <br />
        <Form
          action="Add"
          handleSubmit={handleSubmit}
          render={() => (
            <React.Fragment>
              <Input
                name="name"
                type="text"
                label="Name"
                value={Inputs.values.name}
                onChange={Inputs.handleInputChange}
              />
            </React.Fragment>
          )}
        />
      </Modal>
    </div>
  );
};

interface ISubjectEditProps {
  isOpen: boolean;
  onClose: () => void;
  subject: ISubject | undefined;
  classroomId: string;

  editSubject: (input: ISubjectModify) => Promise<any>;
}

const EditSubject: React.FC<ISubjectEditProps> = ({ isOpen, onClose, classroomId, subject, editSubject }) => {
  const Inputs = useInput({ name: '' });

  React.useEffect(() => {
    subject && Inputs.setValues({ ...Inputs.values, name: subject.name });
  }, [subject]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      classroomId,
      subjectId: String(subject?.id),
      name: Inputs.values.name,
    };

    editSubject(payload).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info"> Update subject: {subject?.name} </Typography>
        <br />
        <Form
          action="Update"
          handleSubmit={handleSubmit}
          render={() => (
            <React.Fragment>
              <Input
                name="name"
                type="text"
                label="Name"
                value={Inputs.values.name}
                onChange={Inputs.handleInputChange}
              />
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
  subject: ISubject | undefined;
  classroomId: string;
  removeSubject: (input: ISubjectRemove) => Promise<any>;
}

const RemoveSubject: React.FC<IRemoveSubjectProps> = ({ isOpen, onClose, classroomId, subject, removeSubject }) => {
  const handleSubmit = () => {
    const payload = {
      classroomId,
      subjectId: String(subject?.id),
    };

    removeSubject(payload).then(() => {
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info">Would you like to remove the subject {subject?.name} </Typography>
        <br />
        <Button variant="secondary" onClick={handleSubmit}>
          Yes
        </Button>
        <Button variant="secondary">No</Button>
      </Modal>
    </div>
  );
};

export default Subjects;
