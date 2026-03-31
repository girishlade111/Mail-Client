import { AlertCircle, Minus, ArrowUp } from 'lucide-react';
import './PriorityBadge.css';

export function PriorityBadge({ priority }) {
  if (!priority || priority === 'normal') return null;

  const config = {
    high: { icon: ArrowUp, label: 'High', className: 'priority-high' },
    low: { icon: Minus, label: 'Low', className: 'priority-low' },
    urgent: { icon: AlertCircle, label: 'Urgent', className: 'priority-urgent' },
  };

  const { icon: Icon, label, className } = config[priority] || config.normal;

  return (
    <span className={`priority-badge ${className}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}