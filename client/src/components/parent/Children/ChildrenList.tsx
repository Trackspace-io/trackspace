import Button from 'components/gui/Button';
import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import { useParents, useUsers } from 'controllers';
import React from 'react';
import { FiUserMinus } from 'react-icons/fi';
import { IStudent } from 'store/students/types';
import Child from './Child';
import style from './Children.module.css';

const ChildrenList: React.FC = () => {
  const Parents = useParents();
  const Users = useUsers();

  const [selectedStudents, setSelectedStudents] = React.useState<IStudent[]>([]);

  const handleToggle = (student: IStudent) => {
    if (selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemove = () => {
    selectedStudents.forEach((student) => {
      const payload = {
        parentId: Users.current.id,
        studentId: student.id,
      };

      Parents.removeChild(payload);
    });
  };

  return (
    <div className={style['children-container']}>
      {Parents.children.length !== 0 ? (
        <div className={style['children-list']}>
          {Parents.children.map((student, i) => (
            <div key={i} onClick={handleToggle.bind(this, student)}>
              <Child student={student} selected={selectedStudents.findIndex((s) => s.id === student.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className={style['list-empty']}>
          <Typography variant="subtitle1">You have not add any child yet.</Typography>
        </div>
      )}
      <div className={style['children-actions']}>
        <br />
        <Divider />
        <Button variant="primary" align="end" disabled={selectedStudents.length === 0} onClick={handleRemove}>
          <FiUserMinus />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ChildrenList;
