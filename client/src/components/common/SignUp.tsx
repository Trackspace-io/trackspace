import * as React from 'react';
import style from '../../styles/common/SignUp.module.css';
import SignUpSrc from '../../images/sign-up.svg';
import Typography from 'components/gui/Typography';
import { Input, useInput } from 'components/gui/Input';
import Button from 'components/gui/Button';
import LinkButton from 'components/gui/LinkButton';

/**
 * Sign up page
 *
 * @param none
 * @returns ReactNode
 */
const SignUp: React.FC = () => {
  const { input, handleInputChange } = useInput({
    email: '',
    lastName: '',
    firstName: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={SignUpSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="subtitle" align="center">
            Sign Up
          </Typography>
          <br />
          <br />
          <form className={style['form']}>
            <Input name="email" type="email" label="Email address" value={input.email} onChange={handleInputChange} />
            <Input name="lastName" type="text" label="Last name" value={input.lastName} onChange={handleInputChange} />
            <Input
              name="firstName"
              type="text"
              label="First name"
              value={input.firstName}
              onChange={handleInputChange}
            />
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
              label="Confirm password"
              value={input.password}
              onChange={handleInputChange}
            />
            <br />
            <Button variant="primary" fullWidth>
              Create account
            </Button>
          </form>
          <LinkButton to="/" variant="secondary">
            Already have an account? Sign in here
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
