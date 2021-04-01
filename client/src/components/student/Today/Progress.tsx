import Checkbox from 'components/gui/Checkbox';
import { Input, useInput } from 'components/gui/Input';
import Tooltip from 'components/gui/Tooltip';
import Typography from 'components/gui/Typography';
import { useClassroomsAsStudent, useMenu } from 'controllers';
import moment from 'moment';
import React from 'react';

import style from './Today.module.css';

interface IProgressProps {
  classroomId: string;
}

const Progress: React.FC<IProgressProps> = ({ classroomId }) => {
  // Controllers
  const Classrooms = useClassroomsAsStudent(classroomId);
  const Menu = useMenu();
  const Inputs = useInput();

  const { terms, progresses } = Classrooms;

  React.useEffect(() => {
    Inputs.setValues(fetchInputs(progresses.byDate));
  }, [progresses.byDate]);

  const fetchInputs = (progress: any) => {
    return progress.subjects?.reduce((acc: any, s: any) => {
      const { progressKey, values } = s;

      Object.keys(values).forEach((v) => {
        acc = { ...acc, [`${progressKey.subjectId}-${v}`]: values[v] || 0 };
      });

      return acc;
    }, {});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, progressKey: any) => {
    const { subjectId, studentId, date } = progressKey;

    const target = e.target.name.split('-');
    const key = target[target.length - 1];
    const value = e.target.value;

    const payload = {
      subjectId,
      studentId,
      date,
      [key]: value,
    };

    progresses
      .setOrUpdate(payload)
      .then((progress) => {
        if (progress) {
          Inputs.setValues(fetchInputs(progress));
        }
      })
      .catch(() => {
        Inputs.setValues(fetchInputs(progresses.byDate));
      });
  };

  if (Menu.date <= moment(terms.selectedTerm?.start) || Menu.date >= moment(terms.selectedTerm?.end)) {
    return <div />;
  }

  if (!terms.selectedTerm?.days?.includes(String(Menu.date.format('dddd').toLowerCase()))) {
    return (
      <div>
        <Typography variant="subtitle" align="center">{`There's no class today.`}</Typography>
      </div>
    );
  }

  return (
    <div>
      <table className={style['table']}>
        <thead>
          <tr>
            <th></th>
            <th>
              <Tooltip text="I would like to start from page _." position="top">
                <Typography variant="info" weight="light">
                  Page from
                </Typography>
              </Tooltip>
            </th>
            <th>
              <Tooltip text="I would like to do _ pages" position="top">
                <Typography variant="info" weight="light">
                  Page set
                </Typography>
              </Tooltip>
            </th>
            <th>
              <Tooltip text="I did _ number of pages" position="top">
                <Typography variant="info" weight="light">
                  Page done
                </Typography>
              </Tooltip>
            </th>
            <th>
              <Tooltip text="Number of pages left" position="top">
                <Typography variant="info" weight="light">
                  Homework
                </Typography>
              </Tooltip>
            </th>
            <th>
              <Typography variant="info" weight="light">
                Homework done
              </Typography>
            </th>
          </tr>
        </thead>
        {progresses.byDate.subjects?.map((s) => {
          const { subject, progressKey } = s;

          return (
            <tbody key={subject.id}>
              <tr>
                <th>
                  <Typography variant="caption" weight="bold">
                    {subject.name}
                  </Typography>
                </th>
                <td>
                  <Input
                    name={`${progressKey.subjectId}-pageFrom`}
                    type="number"
                    value={Inputs.values && Inputs.values[`${progressKey.subjectId}-pageFrom`]}
                    onBlur={(e) => handleChange(e, progressKey)}
                    onChange={Inputs.handleInputChange}
                  />
                </td>
                <td>
                  <Input
                    name={`${progressKey.subjectId}-pageSet`}
                    type="number"
                    value={Inputs.values && Inputs.values[`${progressKey.subjectId}-pageSet`]}
                    onBlur={(e) => handleChange(e, progressKey)}
                    onChange={Inputs.handleInputChange}
                  />
                </td>
                <td>
                  <Input
                    name={`${progressKey.subjectId}-pageDone`}
                    type="number"
                    value={Inputs.values && Inputs.values[`${progressKey.subjectId}-pageDone`]}
                    onBlur={(e) => handleChange(e, progressKey)}
                    onChange={Inputs.handleInputChange}
                  />
                </td>
                <td>
                  <Input
                    name={`${progressKey.subjectId}-homework`}
                    type="number"
                    value={Inputs.values && Inputs.values[`${progressKey.subjectId}-homework`]}
                    disabled
                  />
                </td>
                <td>
                  <Checkbox
                    name={`${progressKey.subjectId}-homeworkDone`}
                    disabled
                    checked={Inputs.values && Inputs.values[`${progressKey.subjectId}-homeworkDone`]}
                    onChange={(e) =>
                      Inputs.setValues({
                        ...Inputs.values,
                        ['homeworkDone']: e.target.checked,
                      })
                    }
                  />
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default Progress;
