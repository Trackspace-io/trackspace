import * as React from 'react';

interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: string[];
  value?: string;
}
const Select: React.FC<ISelectProps> = ({ name, label, options, value, onChange }) => {
  return (
    <div>
      {label && <label> {label}</label>}
      <select name={name} value={value} onChange={onChange}>
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

export default Select;
