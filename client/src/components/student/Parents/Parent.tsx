import cx from 'classnames';
import Tooltip from 'components/gui/Tooltip';
import Typography from 'components/gui/Typography';
import React from 'react';
import { FiCheck, FiUsers, FiUserX } from 'react-icons/fi';
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
          {parent.invitationPendingSince ? (
            <Typography variant="caption">Pending since {parent.invitationPendingSince}</Typography>
          ) : (
            <FiCheck className={style['pending-check']} />
          )}
        </div>
      </div>
      <div className={style['item-confirm']}>
        <Tooltip text="Confirm relationship" position="top">
          {parent.mustConfirm ? <FiUserX onClick={() => setConfirmModal(true)} /> : <FiUsers />}
        </Tooltip>
      </div>
      {confirmModal && (
        <ConfirmRelationship isOpen={confirmModal} onClose={() => setConfirmModal(false)} parentId={parent.id} />
      )}
    </div>
  );
};

export default Parent;
