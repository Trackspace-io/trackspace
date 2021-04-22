import Form from 'components/gui/Form';
import { Input, useInput } from 'components/gui/Input';
import Modal from 'components/gui/Modal';
import Typography from 'components/gui/Typography';
import { useStudents, useUsers } from 'controllers';
import React from 'react';

interface IAddParentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddParent: React.FC<IAddParentProps> = ({ isOpen, onClose }) => {
  // Controllers
  const Inputs = useInput({ email: '' });
  const Students = useStudents();
  const Users = useUsers();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      ...Inputs.values,
      studentId: Users.current.id,
    };

    Students.addParent(payload).then(() => {
      Inputs.setValues({ email: '' });
      onClose();
    });
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Typography variant="info"> Add a parent. </Typography>
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

export default AddParent;
