import { NavbarMini } from 'components/gui/Navbar';
import { useMenu } from 'controllers';
import moment from 'moment';
import { default as SimpleCalendar } from 'rc-calendar';
import React from 'react';

import Notifications from '../Notifications';
import style from './Menu.module.css';

const now = moment();

/**
 * Dashboard's menu. It contains components used across different pages.
 *
 * @param none
 *
 * @returns ReactNode
 */
const Menu: React.FC = () => {
  const Menu = useMenu();

  function handleChange(date: moment.Moment | null) {
    Menu.setDate(moment(date).startOf('day'));
  }

  return (
    <div className={style['container']}>
      <header>
        <NavbarMini />
      </header>
      <div>
        <br />
        <SimpleCalendar
          style={{ margin: '0 auto', width: 'auto', boxShadow: 'none', borderRadius: '16px' }}
          showDateInput={false}
          showToday
          dateInputPlaceholder="please input"
          format={'YYYY-MM-DD'}
          defaultValue={now}
          value={Menu.date || undefined}
          onChange={handleChange}
        />
        <br />
        <Notifications />
      </div>
    </div>
  );
};

export default Menu;
