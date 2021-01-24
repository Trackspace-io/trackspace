import { UserAPI } from 'api';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import LinkButton from 'components/gui/LinkButton';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import SignInSrc from '../../images/teacher.svg';
import style from '../../styles/common/SignIn.module.css';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

/**
 * Sign in page.
 *
 * @param none
 * @returns ReactNode
 */
const SignIn: React.FC = () => {
  const { input, handleInputChange } = useInput({ username: '', password: '' });
  const history = useHistory();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    UserAPI.login(input).then((res) => {
      console.log('res', res);
      history.replace('/test');
    });
  };

  const cookie = Cookies.get('connect.sid');
  console.log('cookie', cookie);

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
                  name="username"
                  type="email"
                  label="Email"
                  value={input.username}
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
