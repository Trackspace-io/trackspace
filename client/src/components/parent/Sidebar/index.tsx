import Divider from 'components/gui/Divider';
import Tooltip from 'components/gui/Tooltip';
import { useParents } from 'controllers';
import React from 'react';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import style from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const Parents = useParents();

  return (
    <div>
      <Tooltip text="Home" position="right">
        <Link to="/student" className={style['home']}>
          <FcHome />
        </Link>
      </Tooltip>
      <Divider />
      {Parents.children.map((student) => (
        <Tooltip key={student.id} text={`${student.firstName} ${student.lastName}`} position="right">
          <div className={style['bubble']}>{student.firstName[0]}</div>
        </Tooltip>
      ))}
    </div>
  );
};

export default Sidebar;
