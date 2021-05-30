import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import React from 'react';

interface IProps {
  update: (inputs: any) => Promise<any>;
}

const Security: React.FC<IProps> = ({ update }) => {
  // Input's fields
  const Inputs = useInput({
    password: '',
    oldPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    update(Inputs.values).then(() => {
      Inputs.setValues({
        password: '',
        oldPassword: '',
        confirmPassword: '',
      });
    });
  };

  return (
    <div>
      <Typography variant="subtitle"> Change password </Typography>
      <Divider />
      <br />
      <Form
        action="Confirm"
        handleSubmit={handleSubmit}
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
};

export default Security;
