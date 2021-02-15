import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import { Sidebar, SidebarItem } from 'components/gui/Sidebar';
import Typography from 'components/gui/Typography';
// import useClassroom from 'controllers/useClassroom';
import * as React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';

import { faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from '../../styles/teacher/Classroom.module.css';
import Students from './Students';
import Subjects from './Subjects';
import Terms from './Terms';

interface RouteParams {
  id: string;
}

const Classroom: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const [shareModal, setShareModal] = React.useState(false);

  // const { classrooms } = useClassroom();
  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">Classroom #</Typography>
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
            <Route path="/teacher/classrooms/:id/students" component={Students} />
            <Route path="/teacher/classrooms/:id/subjects" component={Subjects} />
            <Route path="/teacher/classrooms/:id/terms" component={Terms} />
          </Switch>
        </div>
      </div>
      <ShareLink isOpen={shareModal} onClose={() => setShareModal(false)} />
    </div>
  );
};

interface IShareLinkProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareLink: React.FC<IShareLinkProps> = ({ isOpen, onClose }) => {
  const { input } = useInput({ link: '', search: '' });

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle"> Invite students </Typography>
        <br />
        <div className={style['search-container']}>
          <Typography variant="info"> Search </Typography>
          <Input name="search" type="text" value={input.search} />
        </div>
        <div className={style['students-list']}>Student name</div>
        <div className={style['link-container']}>
          <Typography variant="caption"> Or, send the following link to your students </Typography>
          <Input name="link" type="text" value={input.link} disabled />
        </div>
      </Modal>
    </div>
  );
};

export default Classroom;
