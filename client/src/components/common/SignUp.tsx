import { UserAPI } from 'api';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import LinkButton from 'components/gui/LinkButton';
import { Select, useSelect } from 'components/gui/Select';
import Typography from 'components/gui/Typography';
import * as React from 'react';

import SignUpSrc from '../../images/sign-up.svg';
import style from '../../styles/common/SignUp.module.css';

/**
 * Sign up page
 *
 * @param none
 * @returns ReactNode
 */
const SignUp: React.FC = () => {
  //  const [register, setRegister] = React.useState<SignUp>(createEmptyLogin());

  const { input, handleInputChange } = useInput({
    email: '',
    lastName: '',
    firstName: '',
    password: '',
    confirmPassword: '',
  });

  const { select, handleSelectChange } = useSelect({ role: 'teacher' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = { ...input, role: select.role };
    UserAPI.register(fields);
  };

  return (
    <div className={style['container']}>
      <div className={style['body']}>
        <div className={style['img-container']}>
          <img src={SignUpSrc} className={style['img']} />
        </div>
        <div className={style['content']}>
          <Typography variant="title" align="center">
            Sign Up
          </Typography>
          <Typography variant="caption" align="center">
            as
          </Typography>
          <Form
            handleSubmit={handleSubmit}
            action="Create account"
            render={() => (
              <React.Fragment>
                <Select
                  name="role"
                  options={['teacher', 'student', 'parent']}
                  value={select.role}
                  onChange={handleSelectChange}
                />
                <br />
                <br />
                <Input
                  name="email"
                  type="email"
                  label="Email address"
                  value={input.email}
                  onChange={handleInputChange}
                />
                <Input
                  name="lastName"
                  type="text"
                  label="Last name"
                  value={input.lastName}
                  onChange={handleInputChange}
                />
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
                  value={input.confirmPassword}
                  onChange={handleInputChange}
                />
              </React.Fragment>
            )}
          />
          <LinkButton to="/" variant="secondary">
            Already have an account? Sign in here
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
