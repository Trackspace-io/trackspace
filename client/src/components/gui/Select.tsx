import * as React from 'react';
import style from '../../styles/gui/Select.module.css';
import cx from 'classnames';
/**
 * Component representing a select.
 *
 * @param {{
 * 	name: string,
 * 	label?: string,
 *  options: any[],
 *  value?: string | number,
 *  defaultValue? string | number
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: any[];
  value?: string | number;
  align?: 'start' | 'center' | 'end';
}

const Select: React.FC<ISelectProps> = ({ name, label, options, value, align, onChange }) => {
  return (
    <div className={cx(style['container'], style[`align-${align}`])}>
      {label && <label> {label}</label>}
      <select name={name} value={value} onChange={onChange} className={cx(style['select'])}>
        {options &&
          options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div>
  );
};

/**
 * Custom select hook function.
 *
 * @param {any} initialValue The initial value of the field.
 *
 * @returns {{
 * 	value: any
 * 	setValue: (any) => void
 * 	handleChange: (event) => void
 * }} The use helpers.
 */
const useSelect = (initialValues: any) => {
  const [values, setValues] = React.useState(initialValues);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return { values, setValues, handleSelectChange };
};

export { Select, useSelect };
