import { forwardRef } from 'react';
import './Switch.css';

export const Switch = forwardRef(({ checked, onChange, label, disabled = false, className = '' }, ref) => {
  return (
    <label className={`switch-container ${disabled ? 'disabled' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="switch-input"
      />
      <span className="switch-track">
        <span className="switch-thumb" />
      </span>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';