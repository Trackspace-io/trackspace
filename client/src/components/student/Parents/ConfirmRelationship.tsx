import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useStudents, useUsers } from 'controllers';
import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

import style from './Parents.module.css';

interface IConfirmRelationshipProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
}

const ConfirmRelationship: React.FC<IConfirmRelationshipProps> = ({ isOpen, onClose, parentId }) => {
  const Students = useStudents();
  const Users = useUsers();

  const handleSubmit = () => {
    const payload = {
      studentId: Users.current.id,
      parentId,
    };

    Students.confirmRelationship(payload).then(() => {
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
