import Button from 'components/gui/Button';
import Typography from 'components/gui/Typography';
import React from 'react';
import { FiUserPlus } from 'react-icons/fi';

import AddParent from './AddParent';
import style from './Parents.module.css';
import ParentsList from './ParentsList';

const Parents: React.FC = () => {
  // States
  const [addModal, setAddModal] = React.useState<boolean>(false);

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="title" weight="light">
          Parents / Tutors
        </Typography>
        <Button variant="primary" onClick={() => setAddModal(true)}>
          <FiUserPlus />
          Add
        </Button>
      </div>
      <div className={style['body']}>
        <ParentsList />
      </div>
      {addModal && <AddParent isOpen={addModal} onClose={() => setAddModal(false)} />}
    </div>
  );
};

export default Parents;
