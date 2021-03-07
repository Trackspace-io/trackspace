import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
import * as React from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from '../../styles/teacher/Classroom.module.css';
import Students from './Students';
import Subjects from './Subjects';
import Terms from './Terms';
import useTeachers from 'controllers/useTeachers';
import Button from 'components/gui/Button';
import useClassrooms from 'controllers/useClassrooms';

interface RouteParams {
  id: string;
}

const Classroom: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const Classrooms = useClassrooms(id);

  // Internal state
  const [shareModal, setShareModal] = React.useState(false);

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">{Classrooms.current?.name}</Typography>
        <div className={style['share']} onClick={() => setShareModal(true)}>
          <FontAwesomeIcon icon={faShare} />
          Share
        </div>
      </div>
      <div className={style['body']}>
        <div className={style['sidebar']}>
          <Sidebar>
            <SidebarItem to={`/teacher/classrooms/${id}/students`}> Students </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/subjects`}> Subjects </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/terms`}> Terms </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/goals`}> Goals </SidebarItem>
            <SidebarItem to={`/teacher/classrooms/${id}/progress`}> Progress </SidebarItem>
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
