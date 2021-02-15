import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import style from '../../styles/teacher/Subjects.module.css';

const Subjects: React.FC = () => {
  return (
    <div>
      <div className={style['header']}>
        <Typography variant="subtitle"> Manage subjects </Typography>
      </div>
      <Divider />
    </div>
  );
};

export default Subjects;
