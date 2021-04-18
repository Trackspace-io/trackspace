import Button from 'components/gui/Button';
import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import { useStudents, useUsers } from 'controllers';
import React from 'react';
import { FiUserMinus } from 'react-icons/fi';
import { IParent } from 'store/parents/types';

import Parent from './Parent';
import style from './Parents.module.css';

const ParentsList: React.FC = () => {
  const Students = useStudents();
  const Users = useUsers();

  const [selectedParents, setSelectedParents] = React.useState<IParent[]>([]);

  const handleToggle = (parent: IParent) => {
    const isFound = selectedParents.find((p) => p.id === parent.id);

    if (isFound) {
      setSelectedParents(selectedParents.filter((p) => p.id !== parent.id));
    } else {
      setSelectedParents([...selectedParents, parent]);
    }
  };

  const handleRemove = () => {
    selectedParents.forEach((parent) => {
      const payload = {
        parentId: parent.id,
        studentId: Users.current.id,
      };

      Students.removeParent(payload);
    });
  };

  return (
    <div className={style['parents-container']}>
      {Students.parents.length !== 0 ? (
        <div className={style['parents-list']}>
          {Students.parents.map((parent, i) => (
            <div key={i} onClick={handleToggle.bind(this, parent)}>
              <Parent parent={parent} selected={selectedParents.findIndex((p) => p.id === parent.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div className={style['list-empty']}>
          <Typography variant="subtitle1">You have not add any parent yet.</Typography>
        </div>
      )}
      <div className={style['parents-actions']}>
        <br />
        <Divider />
        <Button variant="primary" align="end" disabled={selectedParents.length === 0} onClick={handleRemove}>
          <FiUserMinus />
          Remove
        </Button>
      </div>
    </div>
  );
};

export default ParentsList;
