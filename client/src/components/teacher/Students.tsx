import Button from 'components/gui/Button';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher } from 'controllers';
import * as React from 'react';
import { FiInfo, FiTrash, FiPlus } from 'react-icons/fi';
import { IStudent, IStudentRemove } from 'store/students/types';

import style from '../../styles/teacher/Students.module.css';
import Share from './Share';

const Students: React.FC<{
  classroomId: string;
}> = ({ classroomId }) => {
  const Classrooms = useClassroomsAsTeacher(classroomId);

  const {
    current: { students },
  } = Classrooms;

  // Internal hooks
  const [action, setAction] = React.useState('');
  const [student, setStudent] = React.useState<IStudent | undefined>(undefined);
  const [shareModal, setShareModal] = React.useState<boolean>(false);

  return (
    <div>
      <div className={style['header']}>
        <Typography variant="title" weight="light">
          Manage students
        </Typography>
        <Button variant="primary" onClick={() => setShareModal(true)}>
          <FiPlus />
        </Button>
      </div>
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
                <FiInfo
                  onClick={() => {
                    setAction('info');
                    setStudent(student);
                  }}
                />
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
          <div className={style['list-empty']}>
            <Typography variant="caption" align="center">
              The list is empty.
            </Typography>
          </div>
        )}
      </div>

      {action === 'remove' && (
        <RemoveStudent
          isOpen={Boolean(action === 'remove')}
          onClose={() => setAction('')}
          student={student}
          classroomId={classroomId}
          removeStudent={students.remove}
        />
      )}

      {action === 'info' && (
        <ParentsInfo
          isOpen={Boolean(action === 'info')}
          onClose={() => setAction('')}
          student={student}
          details={students.details}
          getDetails={students.getDetails}
        />
      )}

      {shareModal && <Share isOpen={shareModal} onClose={() => setShareModal(false)} classroomId={classroomId} />}
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
        <Typography variant="subtitle" weight="light">
          Please type the following statement to remove the selected classroom.
        </Typography>
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

interface IParentsInfoProps {
  isOpen: boolean;
  onClose: () => void;
  student: IStudent | undefined;
  details: IStudent | null;
  getDetails: (studentId: string) => Promise<any>;
}

const ParentsInfo: React.FC<IParentsInfoProps> = ({ isOpen, onClose, student, details, getDetails }) => {
  React.useEffect(() => {
    getDetails(String(student?.id));
  }, [student?.id]);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle" weight="light">
          {`${student?.firstName} ${student?.lastName}'s parents / tutors`}
        </Typography>
        <br />
        {details?.parents.length !== 0 ? (
          details?.parents.map((parent) => (
            <div key={parent.id} className={style['parent-info']}>
              <div>
                <Typography variant="subtitle1">
                  {parent.firstName} {parent.lastName}
                </Typography>
                <Typography variant="caption">{parent.email}</Typography>
              </div>
              <Typography variant="caption">{`Status: ${parent.confirmed ? 'confirmed' : 'pending'}`}</Typography>
            </div>
          ))
        ) : (
          <Typography variant="subtitle1">None</Typography>
        )}
      </Modal>
    </div>
  );
};

export default Students;
