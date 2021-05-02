import Checkbox from 'components/gui/Checkbox';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import React from 'react';
import { IProgressSetOrUpdate, IProgressSubject } from 'store/progresses/types';

import style from './Today.module.css';

interface IProps {
  progress: IProgressSubject;
  setOrUpdate: (payload: IProgressSetOrUpdate) => Promise<any>;
}

const Progress: React.FC<IProps> = ({ progress, setOrUpdate }) => {
  // Controllers
  const Inputs = useInput({});

  // States
  const { subject, values, progressKey } = progress;
  console.log('progress', progress);

  /**
   * Fetch progress' inputs.
   */
  React.useEffect(() => {
    Inputs.setValues(values);
  }, [values]);

  /**
   * Process the data on blur. Reset the value if an error is caught.
   *
   * @param e event
   */
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const payload = {
      ...progressKey,
      [name]: value,
    };

    setOrUpdate(payload).catch(() => {
      Inputs.setValues(values);
    });
  };

  return (
    <div className={style['progress']}>
      <Typography variant="info">{subject.name}</Typography>
      <Input
        name="pageFrom"
        type="number"
        variant="secondary"
        value={Inputs.values.pageFrom}
        onBlur={handleProgressChange}
        onChange={Inputs.handleInputChange}
      />
      <Input
        name="pageSet"
        type="number"
        variant="secondary"
        value={Inputs.values.pageSet}
        onBlur={handleProgressChange}
        onChange={Inputs.handleInputChange}
      />
      <Input
        name="pageDone"
        type="number"
        variant="secondary"
        value={Inputs.values.pageDone}
        onBlur={handleProgressChange}
        onChange={Inputs.handleInputChange}
      />
      <Input
        name="homework"
        type="number"
        disabled
        variant="secondary"
        value={Inputs.values.homework || 0}
        onBlur={handleProgressChange}
        onChange={Inputs.handleInputChange}
      />

      <div className={style['checkbox']}>
        <Checkbox
          name="homeworkDone"
          checked={Inputs.values.homeworkDone}
          onChange={(e) =>
            Inputs.setValues({
              ...Inputs.values,
              [e.target.name]: e.target.checked,
            })
          }
        />
      </div>
    </div>
  );
};

export default Progress;
