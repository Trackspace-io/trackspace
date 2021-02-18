import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import useUser from 'controllers/useUser';
import * as React from 'react';

import style from '../../styles/common/Profile.module.css';

const Profile: React.FC = () => {
  // Get context
  const User = useUser();

  // Internal state
  const [selectedTab, setSelectedTab] = React.useState('profile');

  // Input's fields
  const Inputs = useInput({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    oldPassword: '',
    confirmPassword: '',
  });

  React.useEffect(() => {
    Inputs.setValues({
      email: User.current.email,
      firstName: User.current.firstName,
      lastName: User.current.lastName,
      role: User.current.role,
    });
  }, [User.current]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    User.updateUser(Inputs.values);
  };

  const handleSecuritySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    User.updateUser(Inputs.values).then(() => {
      Inputs.setValues({
        password: '',
        oldPassword: '',
        confirmPassword: '',
      });
    });
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return (
          <div>
            <Typography variant="subtitle"> Public profile </Typography>
            <Divider />
            <br />
            <Form
              action="Confirm"
              handleSubmit={handleProfileSubmit}
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
                </React.Fragment>
              )}
            />
          </div>
        );
      case 'security':
        return (
          <div>
            <Typography variant="subtitle"> Change password </Typography>
            <Divider />
            <br />
            <Form
              action="Confirm"
              handleSubmit={handleSecuritySubmit}
              render={() => (
                <React.Fragment>
                  <Input
                    name="oldPassword"
                    type="password"
                    label="Old password"
                    value={Inputs.values.oldPassword}
                    onChange={Inputs.handleInputChange}
                  />
                  <Input
                    name="password"
                    type="password"
                    label="New password"
                    value={Inputs.values.password}
                    onChange={Inputs.handleInputChange}
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm new password"
                    value={Inputs.values.confirmPassword}
                    onChange={Inputs.handleInputChange}
                  />
                </React.Fragment>
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className={style['container']}>
      <div className={style['header']}>
        <Typography variant="subtitle">
          {User.current?.firstName} {User.current?.lastName}
        </Typography>
        <Typography variant="info">{User.current?.role}</Typography>
        <br />
        <div className={style['tab']} onClick={() => setSelectedTab('profile')}>
          Profile
        </div>
        <div className={style['tab']} onClick={() => setSelectedTab('security')}>
          Account security
        </div>

        <br />
      </div>
      <div className={style['body']}>{renderContent()}</div>
    </div>
  );
};

export default Profile;
