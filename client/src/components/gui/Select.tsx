import * as React from 'react';
import style from '../../styles/gui/Select.module.css';

/**
 * Component representing a select.
 *
 * @param {{
 * 	name: string,
 * 	label?: string,
 *  options: string[],
 *  value?: string | number,
 *  defaultValue? string | number
 * }} props The props of the component.
 *
 * @returns ReactNode
 */
interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: string[];
  value?: string | number;
}

const Select: React.FC<ISelectProps> = ({ name, label, options, value, onChange }) => {
  return (
    <div className={style['container']}>
      {label && <label> {label}</label>}
      <select name={name} value={value} onChange={onChange} className={style['select']}>
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
  const [select, setSelect] = React.useState(initialValues);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelect({
      ...select,
      [e.target.name]: e.target.value,
    });
  };

  return { select, setSelect, handleSelectChange };
};

export { Select, useSelect };
