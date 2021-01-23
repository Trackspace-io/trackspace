import { UserAPI } from 'api';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import LinkButton from 'components/gui/LinkButton';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import SignInSrc from '../../images/teacher.svg';
import style from '../../styles/common/SignIn.module.css';

/**
 * Sign in page.
 *
 * @param none
 * @returns ReactNode
 */
const SignIn: React.FC = () => {
  const { input, handleInputChange } = useInput({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('input', input);
    UserAPI.login(input);
  };

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={SignInSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title" align="center">
            Welcome to Trackspace
          </Typography>
          <br />
          <Typography variant="subtitle" align="center">
            Sign In
          </Typography>
          <br />
          <Form
            handleSubmit={handleSubmit}
            action="Sign in"
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
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  value={input.password}
                  onChange={handleInputChange}
                />
              </React.Fragment>
            )}
          />
          <LinkButton to="/reset-password/send" variant="secondary">
            Forgot password?
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
