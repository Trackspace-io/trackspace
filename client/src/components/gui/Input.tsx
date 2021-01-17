import * as React from 'react';
import style from '../../styles/gui/Input.module.css';
/**
 * Component representing an input.
 *
 * @param {{
 * 	label: string,
 * 	type: string,
 * 	name: string,
 * 	placeholder: string
 *  disabled: bool
 *  value: string
 * }} props The props of the component.
 */
interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type: string;
  value: string | number;
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
      />{' '}
    </div>
  );
};

/**
 * Field hook function.
 *
 * @param {any} initialValue The initial value of the field.
 *
 * @returns {{
 * 	input: any
 * 	setInput: (any) => void
 * 	handleInputChange: (any) => void
 * 	handleInputBlur: (any) => void
 * 	reset: () => void
 * }} The use helpers.
 */

const useInput = (initialState: any) => {
  const [input, setInput] = React.useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  return {
    input,
    setInput,
    handleInputChange,
  };
};

export { Input, useInput };
