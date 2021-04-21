import Divider from 'components/gui/Divider';
import Tooltip from 'components/gui/Tooltip';
import { useParents, useStudents } from 'controllers';
import React from 'react';
import { FcHome } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import style from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  const Parents = useParents();
  const Students = useStudents();
  const [selected, setSelected] = React.useState<number>(-1);

  const handleClick = (studentId: string, i: number) => {
    Students.getClassrooms(studentId).then(() => {
      selected === i ? setSelected(-1) : setSelected(i);
    });
  };

  return (
    <div>
      <Tooltip text="Home" position="right">
        <Link to="/student" className={style['home']}>
          <FcHome />
        </Link>
      </Tooltip>
      <Divider />
      {Parents.children.map((student, i) => (
        <React.Fragment key={student.id}>
          <Tooltip text={`${student.firstName} ${student.lastName}`} position="right">
            <div className={style['bubble']} onClick={handleClick.bind(this, student.id, i)}>
              {student.firstName[0]}
            </div>
          </Tooltip>
          <div>
            {selected === i &&
              Students.classroomsList.map((classroom) => (
                <Tooltip key={classroom.id} text={classroom.name} position="right">
                  <Link
                    to={`/parent/children/${student.id}/classrooms/${classroom.id}`}
                    className={style['sub-bubble']}>
                    {classroom.name[0]}
                  </Link>
                </Tooltip>
              ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;
