import Typography from 'components/gui/Typography';
import React from 'react';
import { IStudent } from 'store/students/types';
import style from './Children.module.css';
import cx from 'classnames';
import { FiUsers, FiUserX } from 'react-icons/fi';
import ConfirmRelationship from './ConfirmRelationship';

interface IChildProps {
  student: IStudent;
  selected: number;
}

const Child: React.FC<IChildProps> = ({ student, selected }) => {
  const [confirmModal, setConfirmModal] = React.useState<boolean>(false);

  return (
    <div className={cx(style['children-item'], style[selected !== -1 ? 'selected' : ''])}>
      <div className={style['item-info']}>
        <div>
          <Typography variant="info">{`${student.firstName} ${student.lastName}`}</Typography>
          <Typography variant="caption">{student.email}</Typography>
        </div>
        <div>
          <Typography variant="caption">{`Pending since ${student.invitationPendingSince}`}</Typography>
        </div>
      </div>
      <div className={style['item-pending']}>
        {!student.mustConfirm ? <FiUserX onClick={() => setConfirmModal(true)} /> : <FiUsers />}
      </div>
      {confirmModal && (
        <ConfirmRelationship isOpen={confirmModal} onClose={() => setConfirmModal(false)} studentId={student.id} />
      )}
    </div>
  );
};

export default Child;
