import { Dropdown, DropdownItem } from 'components/gui/Dropdown';
import Typography from 'components/gui/Typography';
import { useTerms } from 'controllers';
import { dateString } from 'helpers/calendar';
import React from 'react';

import style from './TermDropdown.module.css';

interface IProps {
  classroomId: string;
}

const TermDropdown: React.FC<IProps> = ({ classroomId }) => {
  const Terms = useTerms();

  const handleClick = (termId: string) => {
    Terms.getById({
      classroomId,
      id: termId,
    });
  };

  return (
    <React.Fragment>
      {Terms.list.length !== 0 && (
        <div className={style['dropdown']}>
          <Dropdown type="title" title="Select term">
            {Terms.list.map((term, i) => (
              <DropdownItem key={term.id} type="button" onClick={handleClick.bind(this, term.id)}>
                <Typography variant="caption">
                  {`Term ${i + 1}: ${dateString(term.start)} - ${dateString(term.end)}`}
                </Typography>
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      )}
    </React.Fragment>
  );
};

export default TermDropdown;
