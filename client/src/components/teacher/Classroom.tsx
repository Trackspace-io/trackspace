import Button from 'components/gui/Button';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import { useClassroomsAsTeacher, useTeachers } from 'controllers';
import * as React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FcCheckmark, FcCollaboration, FcComboChart, FcOvertime, FcTimeline } from 'react-icons/fc';
import { FiShare2 } from 'react-icons/fi';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';

import style from '../../styles/teacher/Classroom.module.css';
import Goals from './Goals';
import Students from './Students';
import Subjects from './Subjects';
import Terms from './Terms';
import WeeklyProgresses from './WeeklyProgresses';

interface RouteParams {
  id: string;
}

const Classroom: React.FC = () => {
  // URL param :id
  const { id } = useParams<RouteParams>();

  // Controllers
  const Classrooms = useClassroomsAsTeacher(id);

  // Internal state
  const [shareModal, setShareModal] = React.useState(false);

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">{Classrooms.current?.name}</Typography>
        <div className={style['share']} onClick={() => setShareModal(true)}>
          <FiShare2 />
          <span className={style['text']}>Share</span>
        </div>
      </div>
      <div className={style['body']}>
        <div className={style['sidebar']}>
          <Sidebar>
            <SidebarItem to={`/teacher/classrooms/${id}/students`} icon={<FcCollaboration />}>
              Students
            </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/subjects`} icon={<FcTimeline />}>
              Subjects
            </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/terms`} icon={<FcOvertime />}>
              Terms
            </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/goals`} icon={<FcCheckmark />}>
              Goals
            </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/progresses`} icon={<FcComboChart />}>
              Progress
            </SidebarItem>
          </Sidebar>
        </div>
        <div className={style['content']}>
          <Switch>
            <Route exact path="/teacher/classrooms/:id">
              <Redirect to={`/teacher/classrooms/${id}/students`} />
            </Route>
            <Route path="/teacher/classrooms/:id/students" component={Students} />
            <Route path="/teacher/classrooms/:id/subjects" component={Subjects} />
            <Route path="/teacher/classrooms/:id/terms" component={Terms} />
            <Route path="/teacher/classrooms/:id/goals" component={Goals} />
            <Route path="/teacher/classrooms/:id/progresses" component={WeeklyProgresses} />
          </Switch>
        </div>
      </div>
      {shareModal && <ShareLink isOpen={shareModal} onClose={() => setShareModal(false)} classroomId={id} />}
    </div>
  );
};

interface IShareLinkProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
}

const ShareLink: React.FC<IShareLinkProps> = ({ isOpen, onClose, classroomId }) => {
  // Controllers
  const Teachers = useTeachers();
  const Inputs = useInput({ link: '', search: '' });

  // Internal state
  const [onCopied, setOnCopied] = React.useState(false);

  React.useEffect(() => {
    const payload = {
      classroomId,
      expiresIn: 3600,
    };

    Teachers.generateLink(payload).then((response) => {
      Inputs.setValues({ ...Inputs.values, link: response.link });
    });
  }, []);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle"> Invite students </Typography>
        <br />

        <div className={style['search-container']}>
          <Typography variant="info"> Search </Typography>
          <Input name="search" type="text" value={Inputs.values.search} />
        </div>

        <Typography variant="caption"> Or, send the following link to your students </Typography>

        <div className={style['link-container']}>
          <div className={style['link']}>
            <Input name="link" type="text" value={Inputs.values.link} disabled />
          </div>
          <div className={style['button']}>
            <CopyToClipboard
              text={Inputs.values.link}
              onCopy={() => {
                setOnCopied(true);
                setTimeout(() => {
                  setOnCopied(false);
                }, 3000);
              }}>
              <Button variant="secondary" align="center">
                {!onCopied ? 'Copy' : 'Copied'}
              </Button>
            </CopyToClipboard>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Classroom;
