import { format } from 'date-fns';
import { Star, Paperclip, Archive, Trash2, Clock, MailOpen, Mail, Flag, MoreHorizontal, Check, Tag } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from './ui';
import { useUI } from '../context/UIContext';
import { useMail } from '../context/MailContext';
import './MailRow.css';

export function MailRow({ email, isSelected, onClick, isChecked, onCheckChange }) {
  const [showActions, setShowActions] = useState(false);
  const { addToast } = useUI();
  const { toggleStar, markAsRead, markAsUnread, archiveEmail, deleteEmail, labels, getAccountColor } = useMail();

  const accountColor = getAccountColor(email.accountId);
  
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

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getLabelColor = (labelId) => {
    const label = labels.find(l => l.id === labelId);
    return label?.color || '#6b7280';
  };

  const getLabelName = (labelId) => {
    const label = labels.find(l => l.id === labelId);
    return label?.name || labelId;
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    switch (action) {
      case 'archive':
        archiveEmail(email.id);
        addToast('Archived');
        break;
      case 'delete':
        deleteEmail(email.id);
        addToast('Moved to trash');
        break;
      case 'snooze':
        addToast('Snoozed until tomorrow');
        break;
      case 'markRead':
        markAsRead(email.id);
        addToast('Marked as read');
        break;
      case 'markUnread':
        markAsUnread(email.id);
        addToast('Marked as unread');
        break;
      case 'star':
        toggleStar(email.id);
        break;
      case 'important':
        addToast('Marked as important');
        break;
    }
  };

  return (
    <div
      className={`mail-row ${!email.read ? 'unread' : ''} ${isSelected ? 'selected' : ''} ${showActions ? 'hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="account-strip" style={{ backgroundColor: accountColor }} title="Account" />
      <div className="mail-row-left">
        <label className="mail-checkbox" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isChecked || false}
            onChange={(e) => onCheckChange && onCheckChange(email.id, e.target.checked)}
          />
          <span className="checkbox-custom">
            {isChecked && <Check size={12} />}
          </span>
        </label>
        
        <button 
          className={`star-btn ${email.starred ? 'starred' : ''}`}
          onClick={(e) => handleAction(e, 'star')}
        >
          <Star size={16} fill={email.starred ? '#eab308' : 'none'} />
        </button>
      </div>
      
      <div className="mail-row-avatar">
        <Avatar fallback={email.from.name} size="md" />
        {email.priority === 'high' && (
          <span className="importance-marker" title="High importance">
            <Flag size={10} />
          </span>
        )}
      </div>
      
      <div className="mail-row-content">
        <div className="mail-row-header">
          <div className="mail-from-wrapper">
            <span className="mail-from">{email.from.name}</span>
            {email.labels.length > 0 && (
              <div className="mail-labels-inline">
                {email.labels.slice(0, 2).map((labelId) => (
                  <span 
                    key={labelId} 
                    className="label-dot-small"
                    style={{ backgroundColor: getLabelColor(labelId) }}
                    title={getLabelName(labelId)}
                  />
                ))}
                {email.labels.length > 2 && (
                  <span className="more-labels">+{email.labels.length - 2}</span>
                )}
              </div>
            )}
          </div>
          <div className="mail-row-right">
            {email.attachments && email.attachments.length > 0 && (
              <span className="attachment-indicator" title={`${email.attachments.length} attachment(s)`}>
                <Paperclip size={12} />
              </span>
            )}
            <span className="mail-date">{formatDate(email.date)}</span>
          </div>
        </div>
        
        <div className="mail-row-subject">{email.subject}</div>
        
        <div className="mail-row-preview">
          {stripHtml(email.body).substring(0, 120)}...
        </div>
        
        <div className="mail-row-meta">
          {email.labels.length > 0 && (
            <div className="mail-labels">
              {email.labels.slice(0, 3).map((labelId) => (
                <span 
                  key={labelId} 
                  className="mail-label"
                  style={{ '--label-color': getLabelColor(labelId) }}
                  title={getLabelName(labelId)}
                >
                  <Tag size={10} />
                  {getLabelName(labelId)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={`mail-row-actions ${showActions || isSelected ? 'visible' : ''}`}>
        <button className="action-btn" onClick={(e) => handleAction(e, 'archive')} title="Archive">
          <Archive size={16} />
        </button>
        <button className="action-btn" onClick={(e) => handleAction(e, 'delete')} title="Delete">
          <Trash2 size={16} />
        </button>
        <button className="action-btn" onClick={(e) => handleAction(e, 'snooze')} title="Snooze">
          <Clock size={16} />
        </button>
        <button className="action-btn" onClick={(e) => email.read ? handleAction(e, 'markUnread') : handleAction(e, 'markRead')} title={email.read ? 'Mark unread' : 'Mark read'}>
          {email.read ? <MailOpen size={16} /> : <Mail size={16} />}
        </button>
        <button className="action-btn" onClick={(e) => handleAction(e, 'important')} title="Mark important">
          <Flag size={16} />
        </button>
        <button className="action-btn" title="More">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

export function MailRowSkeleton() {
  return (
    <div className="mail-row skeleton">
      <div className="mail-row-left">
        <div className="skeleton-checkbox" />
        <div className="skeleton-star" />
      </div>
      <div className="skeleton-avatar" />
      <div className="mail-row-content">
        <div className="skeleton-row">
          <div className="skeleton-from" />
          <div className="skeleton-date" />
        </div>
        <div className="skeleton-subject" />
        <div className="skeleton-preview" />
        <div className="skeleton-meta" />
      </div>
    </div>
  );
}