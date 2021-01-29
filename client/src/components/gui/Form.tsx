import * as React from 'react';
import Button from './Button';

interface IFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  render: () => React.ReactNode;
  action: string;
}

const Form: React.FC<IFormProps> = ({ handleSubmit, render, action }) => {
  return (
    <form onSubmit={handleSubmit}>
      {render()}
      <br />
      <Button variant="primary" type="submit" float="right">
        {action}
      </Button>
    </form>
  );
};

export default Form;
