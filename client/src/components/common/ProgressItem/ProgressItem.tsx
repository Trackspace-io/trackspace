import cx from 'classnames';
import Divider from 'components/gui/Divider';
import Typography from 'components/gui/Typography';
import { dateString } from 'helpers/calendar';
import React from 'react';
import { IProgressByWeekValues } from 'store/progresses/types';

import style from './ProgressItem.module.css';

interface IProgressItemProps {
  weekNumber: number;
  week: Partial<IProgressByWeekValues>;
}

const ProgressItem: React.FC<IProgressItemProps> = ({ weekNumber, week }) => {
  const { dates, days, progress } = week;

  return (
    <div>
      {dates && days && (
        <div className={style['progress-header']}>
          <Typography variant="info">{`Week ${weekNumber}`}</Typography>
          <Typography variant="caption" weight="bold">
            {`${dateString(dates[0])} - ${dateString(dates[1])}`}
          </Typography>
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
                    <div className={cx(style['data'], style['title'])}>Homework done</div>
                  </div>
                  {values.map((v) => {
                    return (
                      v && (
                        <div key={v.day} className={style['row']}>
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
    </div>
  );
};

export default ProgressItem;
