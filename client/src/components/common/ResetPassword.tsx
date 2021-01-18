import Button from 'components/gui/Button';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import ResetPasswordSrc from '../../images/reset-password.svg';
import style from '../../styles/common/ResetPassword.module.css';

/**
 * Reset password page
 *
 * @param none
 *
 * @returns ReactNode
 */
export const ResetPasswordSend: React.FC = () => {
  const { input, handleInputChange } = useInput({ email: '' });

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={ResetPasswordSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title">Reset your password</Typography>
          <br />
          <form>
            <Input
              name="email"
              type="email"
              label="Email"
              value={input.email}
              placeholder="johndoe@email.com"
              onChange={handleInputChange}
            />
            <br />
            <Button variant="primary" fullWidth>
              Send email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Choose a new password page. Redirect from Reset password page
 *
 * @param none
 *
 * @returns ReactNode
 */
export const ResetPasswordConfirm: React.FC = () => {
  const { input, handleInputChange } = useInput({ password: '', confirmPassword: '' });

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={ResetPasswordSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title">Choose a new password</Typography>
          <br />
          <form>
            <Input
              name="password"
              type="password"
              label="Password"
              value={input.password}
              onChange={handleInputChange}
            />
            <Input
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              value={input.confirmPassword}
              onChange={handleInputChange}
            />
            <br />
            <Button variant="primary" fullWidth>
              Confirm
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
