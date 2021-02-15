import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import style from '../../styles/teacher/Students.module.css';

const Students: React.FC = () => {
  return (
    <div>
      <div className={style['header']}>
        <Typography variant="subtitle"> Manage students </Typography>
      </div>
      <Divider />
    </div>
  );
};

export default Students;
