import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useParents, useUsers } from 'controllers';
import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

import style from './Children.module.css';

interface IConfirmRelationshipProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

const ConfirmRelationship: React.FC<IConfirmRelationshipProps> = ({ isOpen, onClose, studentId }) => {
  const Parents = useParents();
  const Users = useUsers();

  const handleSubmit = () => {
    const payload = {
      studentId,
      parentId: Users.current.id,
    };

    Parents.confirmRelationship(payload).then(() => {
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info" weight="light">
          Confirm relationship.
        </Typography>
        <br />
        <div className={style['confirm-actions']}>
          <FiX onClick={onClose} />
          <FiCheck onClick={handleSubmit} />
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmRelationship;
