import { format } from 'date-fns';
import { Star, Paperclip } from 'lucide-react';
import { Avatar } from './ui';
import './MailRow.css';

export function MailRow({ email, isSelected, onClick }) {
  const formatDate = (date) => {
    const now = new Date();
    const emailDate = new Date(date);
    
    if (emailDate.toDateString() === now.toDateString()) {
      return format(emailDate, 'h:mm a');
    }
    
    const diffDays = Math.floor((now - emailDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return format(emailDate, 'EEE');
    }
    
    return format(emailDate, 'MMM d');
  };

  return (
    <div
      className={`mail-row ${!email.read ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="mail-row-avatar">
        <Avatar fallback={email.from.name} size="md" />
      </div>
      
      <div className="mail-row-content">
        <div className="mail-row-header">
          <span className="mail-from">{email.from.name}</span>
          <span className="mail-date">{formatDate(email.date)}</span>
        </div>
        
        <div className="mail-row-subject">{email.subject}</div>
        
        <div className="mail-row-preview">
          {email.body.substring(0, 100)}...
        </div>
        
        <div className="mail-row-meta">
          {email.starred && <Star size={14} className="starred-icon" />}
          {email.labels.length > 0 && (
            <div className="mail-labels">
              {email.labels.map((label) => (
                <span key={label} className={`mail-label mail-label-${label}`}>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}