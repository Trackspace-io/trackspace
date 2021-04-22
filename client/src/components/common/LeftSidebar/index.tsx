import Divider from 'components/gui/Divider';
import Tooltip from 'components/gui/Tooltip';
import { useUsers } from 'controllers';
import React from 'react';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';

import style from './LeftSidebar.module.css';

interface IProps {
  list: any;
  to: (item: any) => string;
  name: (item: any) => string;
}

const LeftSidebar: React.FC<IProps> = ({ list, to, name }) => {
  const Users = useUsers();

  return (
    <div>
      <Tooltip text="Home" position="right">
        <Link to={`/${Users.current.role}`} className={style['home']}>
          <FcHome />
        </Link>
      </Tooltip>
      <Divider />
      {list.map((item: any) => (
        <Tooltip key={item.id} text={name(item)} position="right">
          <Link to={to(item)} className={style['bubble']}>
            {name(item)[0]}
          </Link>
        </Tooltip>
      ))}
    </div>
  );
};

export default LeftSidebar;
