import { forwardRef } from 'react';
import './Button.css';

export const Button = forwardRef(({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
  return (
    <button ref={ref} className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
