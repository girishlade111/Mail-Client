import { Archive, Trash2, Mail, MailOpen, Tag, MoreHorizontal, Clock, Flag, AlertTriangle, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useMail } from '../../context/MailContext';
import './BulkActions.css';

export function BulkActions({ 
  selectedCount, 
  onArchive, 
  onDelete, 
  onMarkRead, 
  onMarkUnread, 
  onAddLabel,
  onMoveTo,
  onSnooze,
  onSpam,
  onStar
}) {
  const { labels, moveToFolder, markAsRead, markAsUnread, archiveEmail, deleteEmail, toggleStar } = useMail();
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const labelRef = useRef(null);
  const moveRef = useRef(null);
  const snoozeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (labelRef.current && !labelRef.current.contains(e.target)) setShowLabelMenu(false);
      if (moveRef.current && !moveRef.current.contains(e.target)) setShowMoveMenu(false);
      if (snoozeRef.current && !snoozeRef.current.contains(e.target)) setShowSnoozeMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const folders = [
    { id: 'inbox', name: 'Inbox' },
    { id: 'starred', name: 'Starred' },
    { id: 'sent', name: 'Sent' },
    { id: 'drafts', name: 'Drafts' },
    { id: 'archive', name: 'Archive' },
    { id: 'trash', name: 'Trash' },
  ];

  const snoozeOptions = [
    { id: 'later_today', label: 'Later today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'next_week', label: 'Next week' },
    { id: 'pick_date', label: 'Pick date & time' },
  ];

  return (
    <div className="bulk-actions">
      <div className="bulk-actions-left">
        <span className="selected-count">{selectedCount} selected</span>
        
        <button className="bulk-action-btn" onClick={onMarkRead} title="Mark as read">
          <Mail size={16} />
          <span className="btn-label">Mark read</span>
        </button>
        
        <button className="bulk-action-btn" onClick={onMarkUnread} title="Mark as unread">
          <MailOpen size={16} />
          <span className="btn-label">Mark unread</span>
        </button>
        
        <button className="bulk-action-btn" onClick={onArchive} title="Archive">
          <Archive size={16} />
          <span className="btn-label">Archive</span>
        </button>
        
        <button className="bulk-action-btn danger" onClick={onDelete} title="Delete">
          <Trash2 size={16} />
          <span className="btn-label">Delete</span>
        </button>
      </div>
      
      <div className="bulk-actions-right">
        <div className="dropdown-wrapper" ref={labelRef}>
          <button 
            className="bulk-action-btn" 
            onClick={() => setShowLabelMenu(!showLabelMenu)}
            title="Add label"
          >
            <Tag size={16} />
          </button>
          {showLabelMenu && (
            <div className="dropdown-menu bulk-dropdown">
              {labels.map(label => (
                <button 
                  key={label.id} 
                  className="dropdown-item"
                  onClick={() => {
                    onAddLabel && onAddLabel(label.id);
                    setShowLabelMenu(false);
                  }}
                >
                  <span className="label-dot" style={{ backgroundColor: label.color }} />
                  {label.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown-wrapper" ref={moveRef}>
          <button 
            className="bulk-action-btn" 
            onClick={() => setShowMoveMenu(!showMoveMenu)}
            title="Move to"
          >
            <Archive size={16} />
          </button>
          {showMoveMenu && (
            <div className="dropdown-menu bulk-dropdown">
              {folders.map(folder => (
                <button 
                  key={folder.id} 
                  className="dropdown-item"
                  onClick={() => {
                    onMoveTo && onMoveTo(folder.id);
                    setShowMoveMenu(false);
                  }}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="dropdown-wrapper" ref={snoozeRef}>
          <button 
            className="bulk-action-btn" 
            onClick={() => setShowSnoozeMenu(!showSnoozeMenu)}
            title="Snooze"
          >
            <Clock size={16} />
          </button>
          {showSnoozeMenu && (
            <div className="dropdown-menu bulk-dropdown">
              {snoozeOptions.map(option => (
                <button 
                  key={option.id} 
                  className="dropdown-item"
                  onClick={() => {
                    onSnooze && onSnooze(option.id);
                    setShowSnoozeMenu(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="bulk-action-btn" onClick={onSpam} title="Mark as spam">
          <AlertTriangle size={16} />
        </button>
        
        <button className="bulk-action-btn" onClick={onStar} title="Add star">
          <Star size={16} />
        </button>
      </div>
    </div>
  );
}