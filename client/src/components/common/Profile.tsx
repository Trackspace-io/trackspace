import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import useUser from 'controllers/useUser';
import * as React from 'react';

import style from '../../styles/common/Profile.module.css';

const Profile: React.FC = () => {
  // Get user context
  const { user, updateUser } = useUser();

  // Internal state
  const [selectedTab, setSelectedTab] = React.useState('profile');

  // Input's fields
  const { input, setInput, handleInputChange } = useInput({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    oldPassword: '',
    confirmPassword: '',
  });

  React.useEffect(() => {
    setInput({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser(input);
  };

  const handleSecuritySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.password === input.confirmPassword) {
      updateUser(input);
    }
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
                    value={input.email}
                    placeholder="johndoe@email.com"
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
                    name="lastName"
                    type="text"
                    label="Last name"
                    value={input.lastName}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="role"
                    type="text"
                    label="Role"
                    value={input.role}
                    disabled
                    onChange={handleInputChange}
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
                    value={input.oldPassword}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="password"
                    type="password"
                    label="New password"
                    value={input.password}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm new password"
                    value={input.confirmPassword}
                    onChange={handleInputChange}
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
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="info">{user?.role}</Typography>
        <br />
        <div className={style['tab']} onClick={() => setSelectedTab('profile')}>
          Profile
        </div>
        <div className={style['tab']} onClick={() => setSelectedTab('security')}>
          Account security
        </div>

        <br />
      </div>
      <div className={style['body']}>
        <div className={style['content']}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
