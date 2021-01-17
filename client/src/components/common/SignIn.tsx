import Button from 'components/gui/Button';
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
          <form className={style['form']}>
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
            <br />
            <Button variant="primary" fullWidth>
              Sign in
            </Button>
          </form>
          <LinkButton to="/forgot-password" variant="secondary">
            Forgot password?
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
