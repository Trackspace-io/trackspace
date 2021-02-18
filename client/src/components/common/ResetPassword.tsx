import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import useUser from 'controllers/useUser';
import qs from 'query-string';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

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
  const User = useUser();

  const { input, handleInputChange } = useInput({ email: '' });
  const [emailSent, setEmailSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    User.sendResetPassword(input)
      .then((res) => {
        if (res) {
          setEmailSent(true);
        }
      })
      .catch((e) => console.log('e1', e));
  };

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={ResetPasswordSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title">Reset your password</Typography>
          <br />
          {!emailSent ? (
            <Form
              handleSubmit={handleSubmit}
              action="Submit"
              render={() => (
                <React.Fragment>
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    value={input.email}
                    placeholder="johndoe@email.com"
                    onChange={handleInputChange}
                  />
                </React.Fragment>
              )}
            />
          ) : (
            <div> The email has been sent! Please check your inbox to reset your password. </div>
          )}
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
  const User = useUser();
  const history = useHistory();

  const { t: token } = qs.parse(history.location.search);

  const { input, handleInputChange } = useInput({ password: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { password, confirmPassword } = input;

    User.confirmResetPassword({
      token,
      password,
      confirmPassword,
    });
  };

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={ResetPasswordSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title">Choose a new password</Typography>
          <br />
          <Form
            handleSubmit={handleSubmit}
            action="Submit"
            render={() => (
              <React.Fragment>
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
              </React.Fragment>
            )}
          />
        </div>
      </div>
    </div>
  );
};
