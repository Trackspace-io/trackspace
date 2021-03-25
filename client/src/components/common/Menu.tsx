import { NavbarMini } from 'components/gui/Navbar';
import { useMenu } from 'controllers';
import moment from 'moment';
import { default as SimpleCalendar } from 'rc-calendar';
import React from 'react';

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
    Menu.setDate(date);
  }

  return (
    <div>
      <NavbarMini />
      <br />
      <br />
      <SimpleCalendar
        style={{ margin: '0 auto' }}
        showDateInput={false}
        showToday
        dateInputPlaceholder="please input"
        format={'YYYY-MM-DD'}
        defaultValue={now}
        value={Menu.date || undefined}
        onChange={handleChange}
      />
    </div>
  );
};

export default Menu;
