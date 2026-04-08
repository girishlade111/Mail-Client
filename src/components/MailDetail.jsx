import { format } from 'date-fns';
import { 
  Star, Trash2, Reply, ReplyAll, Forward, MoreHorizontal, Archive, 
  AlertOctagon, Flag, Clock, Tag, FolderOpen, Printer, Download, 
  Ban, BellOff, Calendar, CheckSquare, MoreVertical, X, ChevronDown,
  Paperclip, Image, FileText, File, FileArchive
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Avatar, Button } from './ui';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import './MailDetail.css';

export function MailDetail({ email, onBack, onViewThread }) {
  const { toggleStar, deleteEmail, moveToFolder, markAsUnread, labels, addLabel, archiveEmail } = useMail();
  const { addToast, setComposeOpen } = useUI();
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const actionsRef = useRef(null);
  const moveRef = useRef(null);
  const labelRef = useRef(null);
  const snoozeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) setShowActionsMenu(false);
      if (moveRef.current && !moveRef.current.contains(e.target)) setShowMoveMenu(false);
      if (labelRef.current && !labelRef.current.contains(e.target)) setShowLabelMenu(false);
      if (snoozeRef.current && !snoozeRef.current.contains(e.target)) setShowSnoozeMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!email) {
    return (
      <div className="mail-detail empty">
        <div className="empty-state">
          <div className="empty-icon">📧</div>
          <h3>No message selected</h3>
          <p>Select a message from the list to view it here</p>
        </div>
      </div>
    );
  }

  const getLabelColor = (labelId) => {
    const labelMap = {
      work: '#4361ee', personal: '#8b5cf6', finance: '#22c55e',
      clients: '#f59e0b', team: '#3b82f6', product: '#ec4899',
      marketing: '#06b6d4', urgent: '#ef4444'
    };
    return labelMap[labelId] || '#6b7280';
  };

  const getAttachmentIcon = (type) => {
    if (type.includes('pdf')) return <FileText size={20} />;
    if (type.includes('image')) return <Image size={20} />;
    if (type.includes('zip') || type.includes('archive')) return <FileArchive size={20} />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileText size={20} />;
    return <File size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: '📥' },
    { id: 'starred', name: 'Starred', icon: '⭐' },
    { id: 'sent', name: 'Sent', icon: '📤' },
    { id: 'drafts', name: 'Drafts', icon: '📝' },
    { id: 'archive', name: 'Archive', icon: '📦' },
    { id: 'trash', name: 'Trash', icon: '🗑️' },
    { id: 'spam', name: 'Spam', icon: '⚠️' },
  ];

  const snoozeOptions = [
    { id: 'later_today', label: 'Later today', time: '6:00 PM' },
    { id: 'tomorrow_morning', label: 'Tomorrow morning', time: '9:00 AM' },
    { id: 'tomorrow_evening', label: 'Tomorrow evening', time: '6:00 PM' },
    { id: 'next_week', label: 'Next week', time: 'Mon 9:00 AM' },
  ];

  return (
    <div className="mail-detail">
      <div className="mail-detail-header">
        <div className="mail-detail-actions">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="back-btn" title="Back">
              ←
            </Button>
          )}
          
          <div className="action-buttons-row">
            <Button variant="ghost" size="sm" onClick={() => archiveEmail(email.id)} title="Archive">
              <Archive size={18} />
            </Button>
            
            <div ref={moveRef} className="dropdown-wrapper">
              <Button variant="ghost" size="sm" onClick={() => setShowMoveMenu(!showMoveMenu)} title="Move to">
                <FolderOpen size={18} />
              </Button>
              {showMoveMenu && (
                <div className="dropdown-menu move-menu">
                  {folders.map(f => (
                    <button key={f.id} className="dropdown-item" onClick={() => {
                      moveToFolder(email.id, f.id);
                      addToast(`Moved to ${f.name}`);
                      setShowMoveMenu(false);
                    }}>
                      <span>{f.icon}</span> {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="ghost" size="sm" onClick={() => { deleteEmail(email.id); addToast('Moved to trash'); }} title="Delete">
              <Trash2 size={18} />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => markAsUnread(email.id)} title="Mark unread">
              <Mail size={18} className="mail-icon" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => toggleStar(email.id)} title="Star">
              <Star size={18} className={email.starred ? 'starred' : ''} fill={email.starred ? '#eab308' : 'none'} />
            </Button>

            {email.priority === 'high' && (
              <Button variant="ghost" size="sm" className="priority-indicator" title="High importance">
                <Flag size={18} />
              </Button>
            )}
          </div>
        </div>

        <div className="header-right-actions">
          <div ref={snoozeRef} className="dropdown-wrapper">
            <Button variant="ghost" size="sm" onClick={() => setShowSnoozeMenu(!showSnoozeMenu)} title="Snooze">
              <Clock size={18} />
            </Button>
            {showSnoozeMenu && (
              <div className="dropdown-menu snooze-menu">
                {snoozeOptions.map(opt => (
                  <button key={opt.id} className="dropdown-item" onClick={() => {
                    addToast(`Snoozed until ${opt.label}`);
                    setShowSnoozeMenu(false);
                  }}>
                    <Clock size={14} />
                    <span>{opt.label}</span>
                    <span className="snooze-time">{opt.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={labelRef} className="dropdown-wrapper">
            <Button variant="ghost" size="sm" onClick={() => setShowLabelMenu(!showLabelMenu)} title="Labels">
              <Tag size={18} />
            </Button>
            {showLabelMenu && (
              <div className="dropdown-menu label-menu">
                {labels.map(label => (
                  <button key={label.id} className="dropdown-item" onClick={() => {
                    addLabel(email.id, label.id);
                    addToast(`Added label: ${label.name}`);
                    setShowLabelMenu(false);
                  }}>
                    <span className="label-dot" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={() => moveToFolder(email.id, 'spam')} title="Report spam">
            <AlertOctagon size={18} />
          </Button>

          <div ref={actionsRef} className="dropdown-wrapper">
            <Button variant="ghost" size="sm" onClick={() => setShowActionsMenu(!showActionsMenu)} title="More">
              <MoreHorizontal size={18} />
            </Button>
            {showActionsMenu && (
              <div className="dropdown-menu actions-menu">
                <button className="dropdown-item" onClick={() => { addToast('Printing...'); setShowActionsMenu(false); }}>
                  <Printer size={14} /> Print
                </button>
                <button className="dropdown-item" onClick={() => { addToast('Downloading...'); setShowActionsMenu(false); }}>
                  <Download size={14} /> Download
                </button>
                <button className="dropdown-item" onClick={() => { addToast('Sender blocked'); setShowActionsMenu(false); }}>
                  <Ban size={14} /> Block sender
                </button>
                <button className="dropdown-item" onClick={() => { addToast('Notifications muted'); setShowActionsMenu(false); }}>
                  <BellOff size={14} /> Mute thread
                </button>
                <button className="dropdown-item" onClick={() => { addToast('Task created'); setShowActionsMenu(false); }}>
                  <CheckSquare size={14} /> Add to tasks
                </button>
                <button className="dropdown-item" onClick={() => { addToast('Calendar event created'); setShowActionsMenu(false); }}>
                  <Calendar size={14} /> Create event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mail-detail-content">
        <div className="mail-detail-subject-row">
          <h2 className="mail-detail-subject">{email.subject}</h2>
          {email.labels.length > 0 && (
            <div className="message-labels">
              {email.labels.map(label => (
                <span 
                  key={label} 
                  className="label-chip"
                  style={{ backgroundColor: getLabelColor(label), color: 'white' }}
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="sender-section">
          <Avatar fallback={email.from.name} size="lg" />
          <div className="sender-info">
            <div className="sender-row">
              <span className="sender-name">{email.from.name}</span>
              <span className="sender-email">&lt;{email.from.email}&gt;</span>
            </div>
            <div className="recipients-row">
              <span className="recipients">
                To: {email.to.map(t => t.name).join(', ')}
              </span>
              <button className="expand-recipients" onClick={() => setShowCc(!showCc)}>
                {showCc ? 'Hide' : 'Cc'} <ChevronDown size={12} />
              </button>
            </div>
            {showCc && email.cc.length > 0 && (
              <div className="cc-row">
                CC: {email.cc.map(c => c.name).join(', ')}
              </div>
            )}
            <div className="meta-row">
              <span className="timestamp">
                {format(new Date(email.date), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
              </span>
              {email.attachments.length > 0 && (
                <span className="attachment-count">
                  <Paperclip size={12} /> {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {email.attachments && email.attachments.length > 0 && (
          <div className="attachments-section">
            <div className="attachments-header">
              <Paperclip size={14} />
              <span>{email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}</span>
            </div>
            <div className="attachments-grid">
              {email.attachments.map(att => (
                <div key={att.id} className="attachment-item">
                  <div className="attachment-icon">
                    {getAttachmentIcon(att.type)}
                  </div>
                  <div className="attachment-details">
                    <span className="attachment-name">{att.name}</span>
                    <span className="attachment-size">{formatFileSize(att.size)}</span>
                  </div>
                  <div className="attachment-actions">
                    <button className="att-action" title="Download">
                      <Download size={14} />
                    </button>
                    {att.type.includes('image') && (
                      <button className="att-action" title="Preview">
                        <Image size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mail-detail-body" dangerouslySetInnerHTML={{ __html: email.body }} />

        {email.threadId && (
          <button className="view-thread-btn" onClick={onViewThread}>
            <MessageSquare size={14} />
            View {email.threadId ? 'conversation' : 'thread'}
          </button>
        )}
      </div>

      <div className="mail-detail-reply-bar">
        <Button variant="secondary" onClick={() => setComposeOpen(true)}>
          <Reply size={16} />
          Reply
        </Button>
        <Button variant="secondary">
          <ReplyAll size={16} />
          Reply All
        </Button>
        <Button variant="secondary">
          <Forward size={16} />
          Forward
        </Button>
      </div>
    </div>
  );
}

function Mail(props) {
  const { markAsUnread } = useMail();
  return <span {...props}>{props.children}</span>;
}