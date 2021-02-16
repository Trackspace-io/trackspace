import Typography from 'components/gui/Typography';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Welcome from '../../images/welcome.svg';

import style from '../../styles/common/Error.module.css';

const Error: React.FC = () => {
  const location = useLocation();

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={Welcome} className={style['img']} />
        </div>
        <Typography variant="title">
          No match for <code>{location.pathname}</code>
        </Typography>
      </div>
    </div>
  );
};

export default Error;
