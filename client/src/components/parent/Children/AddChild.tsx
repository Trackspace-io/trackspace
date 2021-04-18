import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useParents, useUsers } from 'controllers';
import React from 'react';

interface IAddChildProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddChild: React.FC<IAddChildProps> = ({ isOpen, onClose }) => {
  // Controllers
  const Inputs = useInput({ email: '' });
  const Parents = useParents();
  const Users = useUsers();

  // States

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...Inputs.values,
      parentId: Users.current.id,
    };

    Parents.addChild(payload).then(() => {
      Inputs.setValues({});
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info"> Add a child. </Typography>
        <br />
        <Form
          action="Add"
          handleSubmit={handleSubmit}
          render={() => (
            <React.Fragment>
              <Input
                name="email"
                type="email"
                label="Email"
                value={Inputs.values.email}
                onChange={Inputs.handleInputChange}
              />
            </React.Fragment>
          )}
        />
      </Modal>
    </div>
  );
};

export default AddChild;
