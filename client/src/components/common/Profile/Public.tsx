import Divider from 'components/gui/Divider';
import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Typography from 'components/gui/Typography';
import React from 'react';
import { IUser } from 'store/users/types';

interface IProps {
  update: (inputs: any) => void;
  current: IUser;
}

const Public: React.FC<IProps> = ({ update, current }) => {
  const Inputs = useInput({
    email: '',
    firstName: '',
    lastName: '',
  });

  React.useEffect(() => {
    const { email, firstName, lastName } = current;

    Inputs.setValues({
      email,
      firstName,
      lastName,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    update(Inputs.values);
  };

  return (
    <div>
      <Typography variant="subtitle"> Public profile </Typography>
      <Divider />
      <br />
      <Form
        action="Confirm"
        handleSubmit={handleSubmit}
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
};

export default Public;
