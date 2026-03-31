import { useState } from 'react';
import { X, Minimize2, Maximize2, Send, Paperclip, MoreHorizontal, ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import { Avatar } from '../ui';
import './ComposeModal.css';

export function ComposeModal({ isOpen, onClose, initialData }) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!to || !subject) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className={`compose-modal ${isMaximized ? 'maximized' : ''}`}>
      <div className="compose-header">
        <span className="compose-title">New Message</span>
        <div className="compose-header-actions">
          <button 
            className="compose-action-btn" 
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="compose-action-btn" onClick={onClose} title="Minimize to drafts">
            <Minimize2 size={16} />
          </button>
          <button className="compose-action-btn" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="compose-body">
        <div className="compose-field">
          <label className="compose-label">To</label>
          <input
            type="text"
            className="compose-input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Recipients"
          />
        </div>

        {!showCc ? (
          <button 
            className="compose-cc-toggle"
            onClick={() => setShowCc(true)}
          >
            Add Cc
          </button>
        ) : (
          <div className="compose-field">
            <label className="compose-label">Cc</label>
            <input
              type="text"
              className="compose-input"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder=""
            />
          </div>
        )}
        
        <div className="compose-divider" />

        <div className="compose-field">
          <input
            type="text"
            className="compose-input subject-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />
        </div>

        <textarea
          className="compose-editor"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
        />
      </div>

      <div className="compose-footer">
        <div className="compose-footer-left">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleSend}
            disabled={!to || !subject || isSending}
          >
            <Send size={16} />
            Send
          </Button>
          <button className="send-options-btn" title="Send options">
            <ArrowDown size={16} />
          </button>
        </div>

        <div className="compose-footer-right">
          <button className="compose-toolbar-btn" title="Formatting">
            <span style={{ fontSize: '14px', fontWeight: 500 }}>A</span>
          </button>
          <button className="compose-toolbar-btn" title="Attach files">
            <Paperclip size={16} />
          </button>
          <button className="compose-toolbar-btn" title="Insert image">
            <span style={{ fontSize: '14px' }}>🖼️</span>
          </button>
          <button className="compose-toolbar-btn ai-assist" title="AI Assist">
            <Sparkles size={16} />
          </button>
          <button className="compose-toolbar-btn" title="More options">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}