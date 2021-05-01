import Button from 'components/gui/Button';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useTeachers } from 'controllers';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import style from './Share.module.css';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
}

const Share: React.FC<IProps> = ({ isOpen, onClose, classroomId }) => {
  // Controllers
  const Teachers = useTeachers();
  const Inputs = useInput({ link: '', email: '' });

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

  /**
   * Send an invitation to a student's email.
   */
  const handleSendInvitation = () => {
    const payload = {
      classroomId,
      studentEmail: Inputs.values.email,
    };

    Teachers.sendInvitation(payload).then(() => {
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="subtitle"> Invite students </Typography>
        <br />

        <Typography variant="info"> Send invitation </Typography>
        <div className={style['input-control']}>
          <Input name="email" type="text" value={Inputs.values.email} onChange={Inputs.handleInputChange} />
          <Button variant="secondary" align="center" onClick={handleSendInvitation}>
            Send
          </Button>
        </div>

        <Typography variant="caption"> Or, send the following link to your students </Typography>

        <div className={style['input-control']}>
          <Input name="link" type="text" value={Inputs.values.link} disabled />
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
      </Modal>
    </div>
  );
};

export default Share;
