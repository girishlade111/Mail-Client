import { useState } from 'react';
import { format } from 'date-fns';
import { Star, MoreHorizontal, Reply, Forward } from 'lucide-react';
import { Avatar } from '../ui';
import './MessageBlock.css';

export function MessageBlock({ message, isExpanded = true }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`message-block ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="message-header">
        <Avatar fallback={message.from.name} size="md" />
        <div className="message-meta">
          <div className="message-sender">
            <span className="sender-name">{message.from.name}</span>
            <span className="sender-email">&lt;{message.from.email}&gt;</span>
          </div>
          <div className="message-time">
            {format(new Date(message.date), 'MMM d, yyyy h:mm a')}
          </div>
        </div>
        {isHovered && (
          <div className="message-actions">
            <button className="action-btn" title="Reply">
              <Reply size={16} />
            </button>
            <button className="action-btn" title="Forward">
              <Forward size={16} />
            </button>
            <button className="action-btn" title="More">
              <MoreHorizontal size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="message-recipients">
        To: {message.to.map(t => t.name).join(', ')}
      </div>

      {message.cc && message.cc.length > 0 && (
        <div className="message-recipients">
          CC: {message.cc.map(c => c.name).join(', ')}
        </div>
      )}

      <div className="message-body">
        <div dangerouslySetInnerHTML={{ __html: message.body }} />
      </div>

      {message.attachments && message.attachments.length > 0 && (
        <div className="message-attachments">
          {message.attachments.map((att) => (
            <div key={att.id} className="attachment-card">
              <div className="attachment-icon">
                {att.type.includes('pdf') ? '📄' : att.type.includes('image') ? '🖼️' : '📎'}
              </div>
              <div className="attachment-info">
                <span className="attachment-name">{att.name}</span>
                <span className="attachment-size">
                  {(att.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {message.quotedReply && (
        <div className="quoted-reply">
          <div className="quoted-header">
            <span>{message.quotedReply.from.name} wrote:</span>
          </div>
          <div className="quoted-content">
            {message.quotedReply.body}
          </div>
        </div>
      )}
    </div>
  );
}