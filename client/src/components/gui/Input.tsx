import * as React from 'react';

import style from '../../styles/gui/Input.module.css';

/**
 * Component representing an input.
 *
 * @param {{
 * 	label?: string,
 * 	type: string,
 * 	name: string,
 *  value?: string
 * 	placeholder?: string
 *  disabled?: bool
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /* The unique input's name */
  name: string;

  /* The label text for the input */
  label?: string;

  /* The input's type */
  type: string;

  /* The input's value */
  value: string | number;

  /* The input's placeholder */
  placeholder?: string;

  /* The input's state */
  disabled?: boolean;
}

const Input: React.FC<IInputProps> = ({ name, label, type, disabled, placeholder, value, onChange, onBlur }) => {
  return (
    <div>
      {label && <label> {label}</label>}
      <input
        disabled={disabled}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value || (type === 'number' ? 0 : '')}
        onChange={onChange}
        onBlur={onBlur}
        className={style['input']}
      />
      {<div className={style['error']}> </div>}
    </div>
  );
};

/**
 * Custom input hook
 *
 * @param {any} initialValue The initial value of the field.
 *
 * @returns {{
 * 	input: any
 * 	setInput: (any) => void
 * 	handleInputChange: (any) => void
 * }} The use helpers.
 */
const useInput = (initialState: any) => {
  const [input, setInput] = React.useState(initialState);
  const [errors, setErrors] = React.useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return { input, setInput, errors, setErrors, handleInputChange };
};

// /**
//  * Validates whether a field has a value
//  * @param {IValues} values - All the field values in the form
//  * @param {string} fieldName - The field to validate
//  * @returns {string} - The error message
//  */
// export const required = (value: string | number): string =>
//   value === undefined || value === null || value === '' ? 'This must be populated' : '';

export { Input, useInput };
