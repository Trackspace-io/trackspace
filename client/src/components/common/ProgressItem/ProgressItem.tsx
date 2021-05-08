import cx from 'classnames';
import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import { dateString } from 'helpers/calendar';
import React from 'react';
import { IProgressByWeekValues } from 'store/progresses/types';

import style from './ProgressItem.module.css';
import ProgressUpdate from './ProgressUpdate';

interface IProgressItemProps {
  weekNumber: number;
  week: Partial<IProgressByWeekValues>;
}

const ProgressItem: React.FC<IProgressItemProps> = ({ weekNumber, week }) => {
  const { dates, days, progress } = week;
  const [updateModal, setUpdateModal] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<any>();

  const handleClick = (values: any) => {
    setValues(values);
    setUpdateModal(!updateModal);
  };

  return (
    <div className={style['progress-container']}>
      {dates && days && (
        <div className={style['progress-header']}>
          <Typography variant="subtitle">{`Week ${weekNumber}`}</Typography>
          <Typography variant="subtitle1">{`${dateString(dates[0])} - ${dateString(dates[1])}`}</Typography>
          {days.map((day) => (
            <Typography key={day} variant="caption" display="inline">{` ${day.slice(0, 3)} `}</Typography>
          ))}
        </div>
      )}
      <Divider />
      {progress && (
        <div className={style['progress-table']}>
          {progress.map((p) => {
            const { subject, values } = p;

            return (
              <div key={subject.id} className={style['subject']}>
                <Typography variant="subtitle1" align="center">
                  {subject.name}
                </Typography>
                <div className={style['body']}>
                  <div className={style['row']}>
                    <div className={style['data']}></div>
                    <div className={cx(style['data'], style['title'])}>Pages from</div>
                    <div className={cx(style['data'], style['title'])}>Pages set</div>
                    <div className={cx(style['data'], style['title'])}>Pages done</div>
                    <div className={cx(style['data'], style['title'])}>Homework</div>
                    <div className={cx(style['data'], style['title'])}>Done</div>
                  </div>
                  {values.map((v) => {
                    return (
                      v && (
                        <div key={v.day} className={style['row-data']} onClick={handleClick.bind(this, v)}>
                          <div className={cx(style['data'], style['day'])}>{v.day.slice(0, 3)}</div>
                          <div className={style['data']}>{v.pageFrom || 0}</div>
                          <div className={style['data']}>{v.pageSet || 0}</div>
                          <div className={style['data']}>{v.pageDone || 0}</div>
                          <div className={style['data']}>{v.homework || 0}</div>
                          <div className={style['data']}>{v.homeworkDone || 'no'}</div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProgressUpdate
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        values={values}
        weekNumber={weekNumber}
      />
    </div>
  );
};

export default ProgressItem;
