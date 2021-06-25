import { Dropdown, DropdownItem, DropdownSection, DropdownTrigger } from 'components/gui/Dropdown';
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
        <Dropdown orientation="right">
          <DropdownTrigger>
            <div className={style['dropdown']}>Select term</div>
          </DropdownTrigger>
          <DropdownSection>
            {Terms.list.map((term, i) => (
              <DropdownItem key={term.id} onClick={handleClick.bind(this, term.id)}>
                <Typography variant="caption">
                  {`Term ${i + 1}: ${dateString(term.start)} - ${dateString(term.end)}`}
                </Typography>
              </DropdownItem>
            ))}
          </DropdownSection>
        </Dropdown>
      )}
    </React.Fragment>
  );
};

export default TermDropdown;
