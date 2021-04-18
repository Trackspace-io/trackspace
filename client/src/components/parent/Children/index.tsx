import Button from 'components/gui/Button';
import Typography from 'components/gui/Typography';
import { useParents } from 'controllers';
import React from 'react';
import { FiUserPlus } from 'react-icons/fi';
import AddChild from './AddChild';
import style from './Children.module.css';
import ChildrenList from './ChildrenList';

const Children: React.FC = () => {
  // Controllers
  const Parents = useParents();

  // States
  const [addModal, setAddModal] = React.useState<boolean>(false);

  console.log('children', Parents.children);

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="title">Children</Typography>
        <Button variant="primary" onClick={() => setAddModal(true)}>
          <FiUserPlus />
          Add
        </Button>
      </div>
      <div className={style['content']}>
        <ChildrenList />
      </div>
      {addModal && <AddChild isOpen={addModal} onClose={() => setAddModal(false)} />}
    </div>
  );
};

export default Children;
