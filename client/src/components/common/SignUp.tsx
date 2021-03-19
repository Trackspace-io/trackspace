import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import LinkButton from 'components/gui/LinkButton';
import { Select, useSelect } from 'components/gui/Select';
import Typography from 'components/gui/Typography';
import { useAuths } from 'controllers';
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
  const Auths = useAuths();

  const Inputs = useInput({
    email: '',
    lastName: '',
    firstName: '',
    password: '',
    confirmPassword: '',
  });

  const { select, handleSelectChange } = useSelect({ role: 'teacher' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fields = { ...Inputs.values, role: select.role };
    Auths.register(fields);
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
                  align="center"
                />
                <br />
                <br />
                <Input
                  name="email"
                  type="email"
                  label="Email address"
                  value={Inputs.values.email}
                  onChange={Inputs.handleInputChange}
                />
                <Input
                  name="lastName"
                  type="text"
                  label="Last name"
                  value={Inputs.values.lastName}
                  onChange={Inputs.handleInputChange}
                />
                <Input
                  name="firstName"
                  type="text"
                  label="First name"
                  value={Inputs.values.firstName}
                  onChange={Inputs.handleInputChange}
                />
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  value={Inputs.values.password}
                  onChange={Inputs.handleInputChange}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  value={Inputs.values.confirmPassword}
                  onChange={Inputs.handleInputChange}
                />
              </React.Fragment>
            )}
          />
          <LinkButton to="/" variant="secondary" align="center">
            Already have an account? Sign in here
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
