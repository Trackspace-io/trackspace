import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import LinkButton from 'components/gui/LinkButton';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import SignInSrc from '../../images/teacher.svg';
import style from '../../styles/common/SignIn.module.css';
import useUser from 'controllers/useUser';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import useMessage from 'controllers/useMessage';

/**
 * Sign in page.
 *
 * @param none
 * @returns ReactNode
 */

interface ISignInProps extends RouteComponentProps {
  location: any | undefined;
}

const SignIn: React.FC<ISignInProps> = ({ location }) => {
  const { login } = useUser();
  const { update } = useMessage();

  const { input, handleInputChange } = useInput({ username: '', password: '' });

  // Verify if the user was redirected to the login page forcefully.
  React.useEffect(() => {
    if (location.state?.error) {
      update({ type: 'error', text: `${location.state.error}` });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(input);
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
          <LinkButton to="/reset-password/send" variant="secondary" align="center">
            Forgot password?
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignIn);
