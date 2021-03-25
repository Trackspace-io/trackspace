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
  value?: string | number;

  /* The input's placeholder */
  placeholder?: string;

  /* The input's state */
  disabled?: boolean;

  /* Checkbox */
  checked?: boolean;
}

const Input: React.FC<IInputProps> = ({
  name,
  label,
  type,
  disabled,
  checked,
  placeholder,
  value,
  onChange,
  onBlur,
}) => {
  return (
    <div>
      {label && <label className={style['label']}> {label}</label>}
      <input
        disabled={disabled}
        type={type}
        name={name}
        placeholder={placeholder}
        value={type === 'number' ? Number.parseInt(String(value)) : value}
        onChange={onChange}
        onBlur={onBlur}
        className={style['input']}
        checked={checked}
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
const useInput = (initialState?: any) => {
  const [values, setValues] = React.useState(initialState);
  const [errors, setErrors] = React.useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('target', e.target.value);

    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return { values, setValues, errors, setErrors, handleInputChange };
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
