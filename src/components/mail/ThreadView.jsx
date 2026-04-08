import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Reply, ReplyAll, Forward, MoreHorizontal, Archive, Trash2, 
  Star, Clock, MoreVertical, ChevronDown, ChevronUp, Paperclip
} from 'lucide-react';
import { Avatar } from '../ui';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import './ThreadView.css';

export function ThreadView({ thread, onBack }) {
  const [expandedMessages, setExpandedMessages] = useState(() => {
    if (!thread || !thread.messages) return {};
    return thread.messages.reduce((acc, msg, idx) => {
      acc[msg.id] = idx === thread.messages.length - 1;
      return acc;
    }, {});
  });
  const { toggleStar, deleteEmail, moveToFolder, archiveEmail } = useMail();
  const { addToast, setComposeOpen } = useUI();

  const toggleMessage = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const toggleAll = (expand) => {
    const newState = {};
    thread.messages.forEach(msg => {
      newState[msg.id] = expand;
    });
    setExpandedMessages(newState);
  };

  if (!thread || !thread.messages || thread.messages.length === 0) {
    return (
      <div className="thread-view empty">
        <div className="empty-state">
          <p>No messages in this thread</p>
        </div>
      </div>
    );
  }

  const totalMessages = thread.messages.length;
  const expandedCount = Object.values(expandedMessages).filter(Boolean).length;
  const hasUnread = thread.messages.some(msg => !msg.read);

  return (
    <div className="thread-view">
      <div className="thread-header">
        <div className="thread-header-left">
          {onBack && (
            <button className="back-btn" onClick={onBack}>←</button>
          )}
          <div className="thread-subject-wrap">
            <h2 className="thread-subject">{thread.subject}</h2>
            {hasUnread && <span className="unread-badge">Unread</span>}
          </div>
        </div>
        <div className="thread-header-right">
          <span className="thread-count">
            {totalMessages} {totalMessages === 1 ? 'message' : 'messages'}
          </span>
          <button className="expand-all-btn" onClick={() => toggleAll(true)} title="Expand all">
            <ChevronDown size={16} />
          </button>
          <button className="expand-all-btn" onClick={() => toggleAll(false)} title="Collapse all">
            <ChevronUp size={16} />
          </button>
        </div>
      </div>

      <div className="thread-messages">
        {thread.messages.map((message, index) => (
          <div key={message.id} className={`thread-message-wrapper ${!message.read ? 'unread-message' : ''}`}>
            {index > 0 && (
              <div className="thread-timeline">
                <div className="timeline-connector" />
                <div className="timeline-dot" />
              </div>
            )}
            
            <div 
              className={`thread-message ${!expandedMessages[message.id] ? 'collapsed' : 'expanded'}`}
              onClick={() => toggleMessage(message.id)}
            >
              {!expandedMessages[message.id] ? (
                <div className="collapsed-preview">
                  <Avatar fallback={message.from.name} size="sm" />
                  <div className="preview-content">
                    <span className="preview-from">{message.from.name}</span>
                    <span className="preview-subject">{message.subject}</span>
                    <span className="preview-date">
                      {format(new Date(message.date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  {message.attachments?.length > 0 && (
                    <Paperclip size={14} className="preview-attachment" />
                  )}
                </div>
              ) : (
                <div className="message-full">
                  <div className="message-header">
                    <Avatar fallback={message.from.name} size="lg" />
                    <div className="message-meta">
                      <div className="message-sender-row">
                        <span className="sender-name">{message.from.name}</span>
                        <span className="sender-email">&lt;{message.from.email}&gt;</span>
                      </div>
                      <div className="message-recipients">
                        <span>To: {message.to.map(t => t.name).join(', ')}</span>
                        {message.cc?.length > 0 && (
                          <span className="cc-display"> · CC: {message.cc.map(c => c.name).join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <div className="message-actions">
                      <span className="message-date">
                        {format(new Date(message.date), 'MMM d, yyyy h:mm a')}
                      </span>
                      <button 
                        className={`action-btn ${message.starred ? 'starred' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); toggleStar(message.id); }}
                        title="Star"
                      >
                        <Star size={16} fill={message.starred ? '#eab308' : 'none'} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={(e) => { e.stopPropagation(); setComposeOpen(true); }}
                        title="Reply"
                      >
                        <Reply size={16} />
                      </button>
                      <button className="action-btn" title="More">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="message-attachments">
                      <div className="att-header">
                        <Paperclip size={12} />
                        <span>{message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="att-list">
                        {message.attachments.map(att => (
                          <div key={att.id} className="att-chip">
                            <span className="att-icon">📎</span>
                            <span className="att-name">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="message-body" dangerouslySetInnerHTML={{ __html: message.body }} />

                  {message.quotedReply && (
                    <div className="quoted-reply">
                      <div className="quoted-header">
                        <span>On {format(new Date(message.quotedReply.date), 'MMM d, yyyy')} {message.quotedReply.from.name} wrote:</span>
                      </div>
                      <div className="quoted-content">
                        {message.quotedReply.body}
                      </div>
                    </div>
                  )}

                  <div className="message-footer">
                    <button className="footer-action" onClick={(e) => { e.stopPropagation(); setComposeOpen(true); }}>
                      <Reply size={14} /> Reply
                    </button>
                    <button className="footer-action" onClick={(e) => e.stopPropagation()}>
                      <ReplyAll size={14} /> Reply All
                    </button>
                    <button className="footer-action" onClick={(e) => e.stopPropagation()}>
                      <Forward size={14} /> Forward
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {expandedCount < totalMessages && (
        <button 
          className="show-earlier-btn"
          onClick={() => toggleAll(true)}
        >
          Show {totalMessages - expandedCount} earlier message{totalMessages - expandedCount > 1 ? 's' : ''}
        </button>
      )}

      <div className="thread-reply-bar">
        <button className="reply-btn">
          <Reply size={16} /> Reply
        </button>
        <button className="reply-btn">
          <ReplyAll size={16} /> Reply All
        </button>
        <button className="reply-btn">
          <Forward size={16} /> Forward
        </button>
      </div>
    </div>
  );
}