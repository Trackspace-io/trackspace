import logo from '../../../images/logo.svg';
import teacherThumbnail from '../../../images/teacher-thumbnail.svg';
import studentThumbnail from '../../../images/student-thumbnail.svg';
import parentThumbnail from '../../../images/parent-thumbnail.svg';
import style from './SetRole.module.css';

import * as React from 'react';
import cx from 'classnames';
import Typography from '../../gui/Typography';
import { Input } from 'components/gui/Input';
import Button from 'components/gui/Button';
import { useState } from 'react';
import { useUsers } from 'controllers';

export const SetRole: React.FC = () => {
  const Users = useUsers();

  const [role, setRole] = useState<string>('teacher');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const submit = () => {
    Users.update({ role, newPassword: password, confirmPassword }).then(() => {
      window.location.replace('');
    });
  };

  return (
    <div className={style['container']}>
      <div className={style['form-container']}>
        <div className={style['form-header']}>
          <img src={logo} className={style['logo']} />
        </div>
        <div className={style['form-content']}>
          <Typography variant="title">Hello,</Typography>
          <Typography variant="subtitle1">
            Thanks for joining Trackspace! We need some information complete the setup of your account.
          </Typography>
          <br />
          <Typography weight="bold" variant="subtitle">
            Account type
          </Typography>
          <Typography variant="caption">Select the type of account that you wish to create.</Typography>
          <div className={style['role-cards']}>
            <div
              className={cx(style['role-card'], style[role === 'teacher' ? 'role-card-selected' : ''])}
              onClick={() => {
                setRole('teacher');
              }}>
              <div className={style['role-card-image']}>
                <img src={teacherThumbnail} className={style['role-thumbnail']} />
              </div>
              <div className={style['role-card-text']}>Teacher account</div>
            </div>
            <div
              className={cx(style['role-card'], style[role === 'student' ? 'role-card-selected' : ''])}
              onClick={() => {
                setRole('student');
              }}>
              <div className={style['role-card-image']}>
                <img src={studentThumbnail} className={style['role-thumbnail']} />
              </div>
              <div className={style['role-card-text']}>Student account</div>
            </div>
            <div
              className={cx(style['role-card'], style[role === 'parent' ? 'role-card-selected' : ''])}
              onClick={() => {
                setRole('parent');
              }}>
              <div className={style['role-card-image']}>
                <img src={parentThumbnail} className={style['role-thumbnail']} />
              </div>
              <div className={style['role-card-text']}>Parent account</div>
            </div>
          </div>
          <Typography weight="bold" variant="subtitle">
            Password
          </Typography>
          <Typography variant="caption">Define your password.</Typography>
          <Input
            name="password"
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password..."
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <br />
          <Button variant="primary" type="submit" align="center" onClick={submit}>
            Create account
          </Button>
        </div>
      </div>
    </div>
  );
};
