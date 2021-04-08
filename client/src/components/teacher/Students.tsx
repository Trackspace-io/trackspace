import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import * as React from 'react';
import { FiTrash } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { IStudentRemove } from 'store/students/types';
import { IStudent } from 'store/students/types';

import style from '../../styles/teacher/Students.module.css';

interface RouteParams {
  id: string;
}

const Students: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const Classrooms = useClassroomsAsTeacher(id);

  const {
    current: { students },
  } = Classrooms;

  // Internal hooks
  const [action, setAction] = React.useState('');
  const [student, setStudent] = React.useState<IStudent | undefined>(undefined);

  return (
    <div>
      <div className={style['header']}>
        <Typography variant="subtitle"> Manage students </Typography>
      </div>
      <Divider />
      <div className={style['body']}>
        <Typography variant="info"> List of students </Typography>
        <div className={style['list']}>
          {students.list.length !== 0 ? (
            students.list.map((student) => (
              <div key={student.id} className={style['item']}>
                <div>
                  <Typography>
                    {student.firstName} {student.lastName}
                  </Typography>
                  <Typography variant="caption">{student.email}</Typography>
                </div>
                <div className={style['actions']}>
                  <FiTrash
                    onClick={() => {
                      setAction('remove');
                      setStudent(student);
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

      {action === 'remove' && (
        <RemoveStudent
          isOpen={Boolean(action === 'remove')}
          onClose={() => setAction('')}
          student={student}
          classroomId={id}
          removeStudent={students.remove}
        />
      )}
    </div>
  );
};

interface IClassroomRemoveProps {
  isOpen: boolean;
  onClose: () => void;
  student: IStudent | undefined;
  classroomId: string;
  removeStudent: (input: IStudentRemove) => Promise<any>;
}

const RemoveStudent: React.FC<IClassroomRemoveProps> = ({ isOpen, onClose, classroomId, student, removeStudent }) => {
  const Inputs = useInput({ text: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      classroomId,
      studentId: String(student?.id),
    };

    if (
      Inputs.values.text === `I would like to remove ${student?.firstName} ${student?.lastName} from the classroom.`
    ) {
      removeStudent(payload).then(() => {
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
                label={`I would like to remove ${student?.firstName} ${student?.lastName} from the classroom.`}
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

export default Students;
