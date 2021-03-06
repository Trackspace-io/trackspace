import Button from 'components/gui/Button';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import LinkButton from 'components/gui/LinkButton';
import Typography from 'components/gui/Typography';
import { useAuths, useUsers } from 'controllers';
import * as React from 'react';
import { FcGoogle } from 'react-icons/fc';

import SignInSrc from '../../images/teacher.svg';
import style from '../../styles/common/SignIn.module.css';

/**
 * Sign in page.
 *
 * @param none
 * @returns ReactNode
 */

const SignIn: React.FC = () => {
  // Controllers
  const Users = useUsers();
  const Auths = useAuths();

  // Inputs
  const Inputs = useInput({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Auths.login(Inputs.values);
  };

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={SignInSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title" align="center">
            Sign In
          </Typography>
          <br />
          <Button
            variant="primary"
            align="center"
            onClick={() => {
              Users.googleSignIn();
            }}>
            <FcGoogle />
            &nbsp;&nbsp;Sign In with Google
          </Button>
          <Form
            handleSubmit={handleSubmit}
            action="Sign in"
            render={() => (
              <React.Fragment>
                <Input
                  name="username"
                  type="email"
                  label="Email"
                  value={Inputs.values.username}
                  placeholder="Email address..."
                  onChange={Inputs.handleInputChange}
                />
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password..."
                  value={Inputs.values.password}
                  onChange={Inputs.handleInputChange}
                />
              </React.Fragment>
            )}
          />
          <LinkButton to="/reset-password/send" variant="secondary" align="center">
            Forgot password?
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
