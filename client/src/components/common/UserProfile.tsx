import Typography from 'components/gui/Typography';
import * as React from 'react';
import style from '../../styles/common/UserProfile.module.css';

const UserProfile: React.FC = () => {
  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="title"> Hi </Typography>
      </div>
      <div className={style['body']}>
        <div className={style['content']}>content</div>
      </div>
    </div>
  );
};

export default UserProfile;
