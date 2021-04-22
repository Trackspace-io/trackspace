import cx from 'classnames';
import Typography from 'components/gui/Typography';
import React from 'react';
import { FiUsers, FiUserX } from 'react-icons/fi';
import { IParent } from 'store/parents/types';

import ConfirmRelationship from './ConfirmRelationship';
import style from './Parents.module.css';

interface IParentProps {
  parent: IParent;
  selected: number;
}

const Parent: React.FC<IParentProps> = ({ parent, selected }) => {
  const [confirmModal, setConfirmModal] = React.useState<boolean>(false);

  return (
    <div className={cx(style['parent-item'], style[selected !== -1 ? 'selected' : ''])}>
      <div className={style['item-info']}>
        <div>
          <Typography variant="info">{`${parent.firstName} ${parent.lastName}`}</Typography>
          <Typography variant="caption">{parent.email}</Typography>
        </div>
        <div>
          <Typography variant="caption">
            {parent.invitationPendingSince ? `Pending since ${parent.invitationPendingSince}` : 'Confirmed'}
          </Typography>
        </div>
      </div>
      <div className={style['item-pending']}>
        {parent.mustConfirm ? <FiUserX onClick={() => setConfirmModal(true)} /> : <FiUsers />}
      </div>
      {confirmModal && (
        <ConfirmRelationship isOpen={confirmModal} onClose={() => setConfirmModal(false)} parentId={parent.id} />
      )}
    </div>
  );
};

export default Parent;
