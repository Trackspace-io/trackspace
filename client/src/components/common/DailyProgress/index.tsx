import style from './DailyProgress.module.css';

import React, { useState } from 'react';
import { IProgressByDateValues, IProgressKey, IProgressValues } from 'store/progresses/types';
import Typography from 'components/gui/Typography';
import { dateString } from 'helpers/calendar';
import moment, { Moment } from 'moment';
import { useProgresses, useTerms } from 'controllers';
import { ITerm } from 'store/terms/types';
import { useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownSection, DropdownTrigger } from 'components/gui/Dropdown';
import SimpleCalendar from 'rc-calendar';
import Tooltip from 'components/gui/Tooltip';
import { ISubject } from 'store/subjects/types';
import { Input } from 'components/gui/Input';
import Checkbox from 'components/gui/Checkbox';

const DailyProgress: React.FC<{
  classroomId: string;
  studentId: string;
  canValidateHomework?: boolean;
}> = ({ classroomId, studentId, canValidateHomework }) => {
  const Terms = useTerms();
  const Progress = useProgresses(classroomId);

  const [date, setDate] = useState<Moment>(moment());
  const [term, setTerm] = useState<ITerm | null>(null);
  const [progress, setProgress] = useState<IProgressByDateValues | null>(null);

  useEffect(() => {
    const _classroomId = classroomId ?? '';
    const _date = date.format('YYYY-MM-DD');

    Terms.getByDate({ classroomId: _classroomId, date: _date }).then((t) => {
      setTerm(t);
    });
  }, [date]);

  useEffect(() => {
    const _classroomId = classroomId ?? '';
    const _studentId = studentId ?? '';
    const _date = date.format('YYYY-MM-DD');

    Progress.getByDate({
      classroomId: _classroomId,
      studentId: _studentId,
      date: _date,
    })
      .then((p) => {
        setProgress(p as IProgressByDateValues);
      })
      .catch(() => {
        setProgress(null);
      });
  }, [classroomId, studentId, date]);

  return (
    <>
      {/* Date selector */}
      <div className={style['date-selector']}>
        <Dropdown orientation="right">
          <DropdownTrigger>
            <div className={style['date-dropdown-button']}>Select Date</div>
          </DropdownTrigger>
          <DropdownSection>
            <DropdownItem>
              <SimpleCalendar
                style={{
                  boxShadow: 'none',
                  margin: '0',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: '80%',
                }}
                showDateInput={false}
                showToday
                format={'YYYY-MM-DD'}
                defaultValue={moment()}
                value={date}
                onChange={(date) => {
                  setDate(date ?? moment());
                }}
              />
            </DropdownItem>
          </DropdownSection>
        </Dropdown>
      </div>

      {/* Title */}
      <div className={style['title']}>
        <Typography variant="title" align="center" weight="light">
          {`${date && dateString(date.toLocaleString())}`}
        </Typography>
        {term && (
          <Typography variant="subtitle1">
            {`Term ${term?.number} | Week ${term?.currentWeek} | ${dateString(term?.start)} - ${dateString(term?.end)}`}
          </Typography>
        )}
        {term?.days?.map((day) => (
          <Typography key={day} variant="caption" display="inline" weight="light">
            {` ${day.slice(0, 3).toUpperCase()} `}
          </Typography>
        ))}
      </div>

      {/* Table */}
      <div className={style['table']}>
        {progress ? (
          <>
            <div className={style['progress-header']}>
              <Typography />
              <Tooltip text="I would like to start from page X" position="top">
                <Typography variant="subtitle1">Start page</Typography>
              </Tooltip>
              <Tooltip text="I would like to do X pages" position="top">
                <Typography variant="subtitle1">Page set</Typography>
              </Tooltip>
              <Tooltip text="I did X number of pages" position="top">
                <Typography variant="subtitle1">Got to</Typography>
              </Tooltip>
              <Tooltip text="Number of pages left" position="top">
                <Typography variant="subtitle1">Homework</Typography>
              </Tooltip>
              <Typography variant="subtitle1">Done</Typography>
            </div>
            <div>
              {progress.subjects?.map((progress, index) => (
                <Row
                  key={index}
                  classroomId={classroomId ?? ''}
                  subject={progress.subject}
                  progressKey={progress.progressKey}
                  values={progress.values}
                  canValidateHomework={canValidateHomework}
                />
              ))}
            </div>
          </>
        ) : (
          <Typography align="center">There are no courses on this date</Typography>
        )}
      </div>
    </>
  );
};

const Row: React.FC<{
  classroomId: string;
  subject: ISubject;
  progressKey: IProgressKey;
  values: IProgressValues;
  canValidateHomework?: boolean;
}> = ({ classroomId, subject, progressKey, values, canValidateHomework }) => {
  const Progress = useProgresses(classroomId);

  const [pageFrom, setPageFrom] = useState<number | undefined>(undefined);
  const [pageSet, setPageSet] = useState<number | undefined>(undefined);
  const [pageDone, setPageDone] = useState<number | undefined>(undefined);
  const [homework, setHomework] = useState<number>(0);
  const [homeworkDone, setHomeworkDone] = useState<boolean>(false);

  useEffect(() => {
    resetValues();
  }, [values]);

  useEffect(() => {
    saveProgress();
  }, [homeworkDone]);

  const resetValues = () => {
    setPageFrom(values.pageFrom);
    setPageSet(values.pageSet);
    setPageDone(values.pageDone);
    setHomework(values.homework);
    setHomeworkDone(values.homeworkDone);
  };

  const saveProgress = () => {
    Progress.setOrUpdate({
      ...progressKey,
      pageFrom,
      pageSet,
      pageDone,
      homeworkDone: canValidateHomework ? homeworkDone : undefined,
    }).catch(() => {
      resetValues();
    });
  };

  return (
    <div className={style['progress']}>
      <Typography variant="info">{subject.name}</Typography>
      <Input
        name="pageFrom"
        type="number"
        variant="secondary"
        value={pageFrom}
        onBlur={saveProgress}
        onChange={(e) => {
          setPageFrom(parseInt(e.target.value));
        }}
      />
      <Input
        name="pageSet"
        type="number"
        variant="secondary"
        value={pageSet}
        onBlur={saveProgress}
        onChange={(e) => {
          setPageSet(parseInt(e.target.value));
        }}
      />
      <Input
        name="pageDone"
        type="number"
        variant="secondary"
        value={pageDone}
        onBlur={saveProgress}
        onChange={(e) => {
          setPageDone(parseInt(e.target.value));
        }}
      />
      <Input
        name="homework"
        type="number"
        disabled
        variant="secondary"
        value={homework || 0}
        onBlur={saveProgress}
        onChange={(e) => {
          setHomework(parseInt(e.target.value));
        }}
      />
      <div className={style['checkbox']}>
        <Checkbox
          name="homeworkDone"
          checked={homeworkDone}
          disabled={!canValidateHomework}
          onChange={(e) => {
            setHomeworkDone(e.target.checked);
          }}
        />
      </div>
    </div>
  );
};

export default DailyProgress;
