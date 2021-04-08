import SearchBar from 'components/gui/SearchBar';
import Typography from 'components/gui/Typography';
import React from 'react';
import { IStudent } from 'store/students/types';

import style from './WeeklyProgresses.module.css';

interface IStudentsSearchBarProps {
  studentsList: IStudent[];
  setStudentId: (studentId: string) => void;
}

const StudentsSearchBar: React.FC<IStudentsSearchBarProps> = ({ studentsList, setStudentId }) => {
  return (
    <div>
      <Typography variant="subtitle1">Enter the name or email address of a student</Typography>
      <SearchBar
        items={studentsList}
        text={(student: IStudent) => {
          return student.firstName + ' ' + student.lastName + ' (' + student.email + ')';
        }}
        render={(student: IStudent, i: number) => {
          return (
            <div
              key={i}
              className={style['search-item']}
              onClick={() => {
                setStudentId(student.id);
              }}>
              <span className={style['search-item-name']}>{student.firstName + ' ' + student.lastName}</span>
              &nbsp;&nbsp;
              <span className={style['search-item-email']}>{student.email}</span>
            </div>
          );
        }}
      />
    </div>
  );
};

export default StudentsSearchBar;
