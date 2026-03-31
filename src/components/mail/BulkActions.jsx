import { Archive, Trash2, Mail, MailOpen, Tag, MoreHorizontal } from 'lucide-react';
import './BulkActions.css';

export function BulkActions({ selectedCount, onArchive, onDelete, onMarkRead, onMarkUnread, onAddLabel }) {
  return (
    <div className="bulk-actions">
      <div className="bulk-actions-left">
        <span className="selected-count">{selectedCount} selected</span>
        
        <button className="bulk-action-btn" onClick={onMarkRead} title="Mark as read">
          <Mail size={16} />
          <span>Mark read</span>
        </button>
        
        <button className="bulk-action-btn" onClick={onMarkUnread} title="Mark as unread">
          <MailOpen size={16} />
          <span>Mark unread</span>
        </button>
        
        <button className="bulk-action-btn" onClick={onArchive} title="Archive">
          <Archive size={16} />
          <span>Archive</span>
        </button>
        
        <button className="bulk-action-btn danger" onClick={onDelete} title="Delete">
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
      
      <div className="bulk-actions-right">
        <button className="bulk-action-btn" onClick={onAddLabel} title="Add label">
          <Tag size={16} />
        </button>
        
        <button className="bulk-action-btn" title="More">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}