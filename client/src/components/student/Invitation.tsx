import Button from 'components/gui/Button';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import SignInSrc from '../../images/teacher.svg';
import SignUpSrc from '../../images/student.svg';
import style from '../../styles/student/Invitation.module.css';
import useStudents from 'controllers/useStudents';
import qs from 'query-string';

const Invitations: React.FC = () => {
  const Students = useStudents();
  const history = useHistory();

  const { t: token } = qs.parse(history.location.search);

  const [toggle, setToggle] = React.useState(true);

  React.useEffect(() => {
    Students.getInvitationInfo({ token: String(token) });
  }, []);

  return (
    <div className={style['container']}>
      <div className={style['main']}>
        <div className={style['header']}>
          <div className={style['img-container']}>
            <img src={toggle ? SignInSrc : SignUpSrc} />
          </div>
          <Typography variant="subtitle1" align="center">
            {Students.invitationInfo.teacherFirstName} {Students.invitationInfo.teacherLastName} has invited you to join{' '}
            {Students.invitationInfo.classroomName}.
          </Typography>
          <br />
        </div>
        <div className={style['body']}>
          {toggle ? <SignIn token={token} /> : <SignUp token={token} />}
          <Typography variant="caption" align="center">
            Or
          </Typography>
          <Button variant="secondary" align="center" onClick={() => setToggle(!toggle)}>
            {toggle ? 'Sign up here' : 'Sign in here'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ISignInProps {
  token: string | string[] | null;
}

const SignIn: React.FC<ISignInProps> = ({ token }) => {
  const Students = useStudents();

  // Inputs
  const Inputs = useInput({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { ...Inputs.values, token };

    Students.acceptInvitationBySignIn(payload);
  };

  return (
    <div>
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
              placeholder="johndoe@email.com"
              onChange={Inputs.handleInputChange}
            />
            <Input
              name="password"
              type="password"
              label="Password"
              value={Inputs.values.password}
              onChange={Inputs.handleInputChange}
            />
          </React.Fragment>
        )}
      />
    </div>
  );
};

interface ISignUpProps {
  token: string | string[] | null;
}

const SignUp: React.FC<ISignUpProps> = ({ token }) => {
  const Students = useStudents();

  // Inputs
  const Inputs = useInput({ email: '', firstName: '', lastName: '', password: '', confirmPassword: '' });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = { ...Inputs.values, token };

    Students.acceptInvitationBySignUp(payload);
  };

  return (
    <div>
      <Form
        handleSubmit={handleSubmit}
        action="Sign up"
        render={() => (
          <React.Fragment>
            <Input
              name="email"
              type="email"
              label="Email"
              value={Inputs.values.email}
              placeholder="johndoe@email.com"
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
              name="lastName"
              type="text"
              label="Last name"
              value={Inputs.values.lastName}
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
    </div>
  );
};
export default Invitations;
