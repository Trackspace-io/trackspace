import * as React from 'react';

import style from '../../styles/gui/Checkbox.module.css';

interface ICheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  name: string;
  label?: string;
  checked: boolean;
}

const Checkbox: React.FC<ICheckboxProps> = ({ disabled, label, name, onChange, checked }) => {
  return (
    <div className={style['container']}>
      {label && <label className={style['label']}> {label}</label>}
      <input
        disabled={disabled}
        type="checkbox"
        name={name}
        // value={value || (type === 'number' ? 0 : '')}
        onChange={onChange}
        className={style['checkbox']}
        checked={checked}
      />
    </div>
  );
};

export default Checkbox;
