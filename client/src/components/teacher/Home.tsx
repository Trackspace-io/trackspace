import Button from 'components/gui/Button';
import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassrooms, useTeachers } from 'controllers';
import * as React from 'react';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { Route, Switch } from 'react-router-dom';
import { IClassroom, IClassroomCreate, IClassroomModify, IClassroomRemove } from 'store/classrooms/types';

import style from '../../styles/teacher/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">Dashboard</Typography>
      </div>
      <div className={style['body']}>
        <div className={style['sidebar']}>
          <Sidebar>
            <SidebarItem to="/teacher/classrooms"> My classrooms </SidebarItem>
            <SidebarItem to="/teacher/settings"> Settings </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route path="/teacher/classrooms" component={Classrooms} />
          </Switch>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

const Classrooms: React.FC = () => {
  const Classrooms = useClassrooms();
  const Teachers = useTeachers();

  const [action, setAction] = React.useState('');
  const [classroom, setClassroom] = React.useState<IClassroom | undefined>(undefined);

  return (
    <div>
      <div className={style['classrooms-header']}>
        <Typography variant="subtitle"> Manage classrooms </Typography>
        <Button variant="primary" onClick={() => setAction('create')}>
          Create classroom
        </Button>
      </div>
      <Divider />
      <div className={style['classrooms-body']}>
        <Typography variant="info"> List of classrooms </Typography>
        <div className={style['classrooms-list']}>
          {Teachers.classroomsList.length !== 0 ? (
            Teachers.classroomsList.map((classroom) => (
              <div key={classroom.id} className={style['classroom-item']}>
                <a href={`/teacher/classrooms/${classroom.id}`}>{classroom.name}</a>
                <div className={style['classroom-actions']}>
                  <FiEdit2
                    onClick={() => {
                      setAction('modify');
                      setClassroom(classroom);
                    }}
                  />
                  <FiTrash
                    onClick={() => {
                      setAction('remove');
                      setClassroom(classroom);
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

      {action === 'create' && (
        <ClassroomCreate
          isOpen={Boolean(action === 'create')}
          onClose={() => setAction('')}
          create={Classrooms.create}
        />
      )}

      {action === 'modify' && (
        <ClassroomUpdate
          isOpen={Boolean(action === 'modify')}
          onClose={() => setAction('')}
          classroom={classroom}
          modify={Classrooms.modify}
        />
      )}

      {action === 'remove' && (
        <ClassroomRemove
          isOpen={Boolean(action === 'remove')}
          onClose={() => setAction('')}
          classroom={classroom}
          remove={Classrooms.remove}
        />
      )}
    </div>
  );
};

interface IClassroomCreateProps {
  isOpen: boolean;
  onClose: () => void;
  create: (input: IClassroomCreate) => Promise<any>;
}

const ClassroomCreate: React.FC<IClassroomCreateProps> = ({ isOpen, onClose, create }) => {
  const Inputs = useInput({ name: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    create(Inputs.values).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info"> Create a new classroom. </Typography>
        <br />
        <Form
          action="Create"
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

interface IClassroomUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: IClassroom | undefined;
  modify: (input: IClassroomModify) => Promise<any>;
}

const ClassroomUpdate: React.FC<IClassroomUpdateProps> = ({ isOpen, onClose, classroom, modify }) => {
  const Inputs = useInput({ name: '' });

  React.useEffect(() => {
    classroom && Inputs.setValues({ ...Inputs.values, name: classroom.name });
  }, [classroom]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      name: Inputs.values.name,
      id: String(classroom?.id),
    };

    modify(payload).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info"> Update classroom: {classroom?.name} </Typography>
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

interface IClassroomRemoveProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: IClassroom | undefined;
  remove: (input: IClassroomRemove) => Promise<any>;
}

const ClassroomRemove: React.FC<IClassroomRemoveProps> = ({ isOpen, onClose, classroom, remove }) => {
  const Inputs = useInput({ text: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Inputs.values.text === `I would like to remove the classroom ${classroom?.name}.`) {
      remove({ id: String(classroom?.id) }).then(() => {
        Inputs.setValues({});
        onClose();
      });
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info">Please type the following statement to remove the selected classroom.</Typography>
        <br />
        <Form
          action="Confirm"
          handleSubmit={handleSubmit}
          render={() => (
            <React.Fragment>
              <Input
                name="text"
                type="text"
                label={`I would like to remove the classroom ${classroom?.name}.`}
                value={Inputs.values.text}
                onChange={Inputs.handleInputChange}
              />
            </React.Fragment>
          )}
        />
      </Modal>
    </div>
  );
};

export default Home;
