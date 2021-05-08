import Button from 'components/gui/Button';
import Checkbox from 'components/gui/Checkbox';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useProgresses, useTerms } from 'controllers';
import React from 'react';
import { useParams } from 'react-router';
import style from './ProgressItem.module.css';

interface RouteParams {
  classroomId: string;
}

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  values: any;
  weekNumber: number;
}

const ProgressUpdate: React.FC<IProps> = ({ isOpen, onClose, values, weekNumber }) => {
  const { classroomId } = useParams<RouteParams>();

  const Progresses = useProgresses(classroomId);
  const Terms = useTerms();

  const Inputs = useInput({
    pageFrom: '',
    pageSet: '',
    pageDone: '',
    homework: '',
    homeworkDone: false,
  });

  React.useEffect(() => {
    console.log('test');

    values &&
      Inputs.setValues({
        ...Inputs.values,
        pageFrom: values.pageFrom,
        pageSet: values.pageSet,
        pageDone: values.pageDone,
        homework: values.homework,
        homeworkDone: values.homeworkDone,
      });
  }, [values]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      progressKey: { date, studentId, subjectId },
    } = values;

    const { pageFrom, pageSet, pageDone } = Inputs.values;
    const termId = String(Terms.currentTerm?.id);

    Progresses.setOrUpdate({
      date,
      studentId,
      subjectId,
      pageDone,
      pageFrom,
      pageSet,
    }).then(() => {
      Progresses.getByWeek({
        studentId,
        termId,
        weekNumber,
      });

      Progresses.getProgressGraph({
        studentId,
        termId,
      });

      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle" align="center" weight="light">
          Update progress.
        </Typography>
        <br />

        <form onSubmit={handleSubmit} className={style['form']}>
          <div className={style['inputs']}>
            <Input
              name="pageFrom"
              type="number"
              label="Start Page"
              value={Inputs.values.pageFrom}
              onChange={Inputs.handleInputChange}
            />
            <Input
              name="pageSet"
              type="number"
              label="Page set"
              value={Inputs.values.pageSet}
              onChange={Inputs.handleInputChange}
            />
            <Input
              name="pageDone"
              type="number"
              label="Got to"
              value={Inputs.values.pageDone}
              onChange={Inputs.handleInputChange}
            />
            <Input
              name="homework"
              type="number"
              label="Homework"
              value={Inputs.values.homework}
              onChange={Inputs.handleInputChange}
            />
            <div className={style['checkbox']}>
              <Checkbox
                name="homeworkDone"
                label="Done"
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
          <Button type="submit" variant="primary" align="center">
            Update
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProgressUpdate;
