import { forwardRef } from 'react';
import './Checkbox.css';

export const Checkbox = forwardRef(({ checked, onChange, label, indeterminate = false, className = '' }, ref) => {
  return (
    <label className={`checkbox-container ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
      />
      <span className={`checkbox-box ${indeterminate ? 'indeterminate' : ''}`}>
        {indeterminate ? '−' : '✓'}
      </span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';