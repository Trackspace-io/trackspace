import Button from 'components/gui/Button';
import Typography from 'components/gui/Typography';
import React from 'react';
import { FiUserPlus } from 'react-icons/fi';
import AddChild from './AddChild';
import style from './Children.module.css';
import ChildrenList from './ChildrenList';

const Children: React.FC = () => {
  // States
  const [addModal, setAddModal] = React.useState<boolean>(false);

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="title" weight="light">
          Students
        </Typography>
        <Button variant="primary" onClick={() => setAddModal(true)}>
          <FiUserPlus />
        </Button>
      </div>
      <div className={style['body']}>
        <ChildrenList />
      </div>
      {addModal && <AddChild isOpen={addModal} onClose={() => setAddModal(false)} />}
    </div>
  );
};

export default Children;
