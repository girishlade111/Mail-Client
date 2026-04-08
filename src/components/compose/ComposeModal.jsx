import { useState } from 'react';
import { X, Minimize2, Maximize2, Send, Paperclip, MoreHorizontal, ArrowDown, Sparkles, Clock, Flag, Trash2, Bold, Italic, Underline, List, Link, Image, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '../ui';
import { Avatar } from '../ui';
import './ComposeModal.css';

export function ComposeModal({ isOpen, onClose }) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [priority, setPriority] = useState('normal');
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleSend = () => {
    if (!to || !subject) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1000);
  };

  const aiOptions = [
    { id: 'rewrite', label: 'Rewrite', icon: '✏️' },
    { id: 'shorten', label: 'Shorten', icon: '✂️' },
    { id: 'improve', label: 'Improve tone', icon: '📝' },
    { id: 'summarize', label: 'Summarize', icon: '📋' },
  ];

  const scheduleOptions = [
    { id: 'now', label: 'Send now' },
    { id: 'later_today', label: 'Later today' },
    { id: 'tomorrow_morning', label: 'Tomorrow morning' },
    { id: 'tomorrow_afternoon', label: 'Tomorrow afternoon' },
    { id: 'next_week', label: 'Next week' },
    { id: 'custom', label: 'Pick date & time' },
  ];

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

        <div className="compose-cc-row">
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
              <button className="compose-cc-remove" onClick={() => setShowCc(false)}>×</button>
            </div>
          )}
          
          {!showBcc ? (
            <button 
              className="compose-cc-toggle"
              onClick={() => setShowBcc(true)}
            >
              Add Bcc
            </button>
          ) : (
            <div className="compose-field">
              <label className="compose-label">Bcc</label>
              <input
                type="text"
                className="compose-input"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder=""
              />
              <button className="compose-cc-remove" onClick={() => setShowBcc(false)}>×</button>
            </div>
          )}
        </div>
        
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

        {attachments.length > 0 && (
          <div className="compose-attachments">
            {attachments.map((file, index) => (
              <div key={index} className="attachment-chip">
                <Paperclip size={12} />
                <span>{file.name}</span>
                <button onClick={() => setAttachments(a => a.filter((_, i) => i !== index))}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          className="compose-editor"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message..."
        />
      </div>

      {showAiPanel && (
        <div className="compose-ai-panel">
          <div className="ai-panel-header">
            <Sparkles size={14} />
            <span>AI Assist</span>
            <button className="ai-panel-close" onClick={() => setShowAiPanel(false)}>×</button>
          </div>
          <div className="ai-options">
            {aiOptions.map((option) => (
              <button key={option.id} className="ai-option">
                <span className="ai-option-icon">{option.icon}</span>
                <span className="ai-option-label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="compose-toolbar">
        <div className="toolbar-group">
          <button className="toolbar-btn" title="Bold"><Bold size={14} /></button>
          <button className="toolbar-btn" title="Italic"><Italic size={14} /></button>
          <button className="toolbar-btn" title="Underline"><Underline size={14} /></button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" title="Bullet list"><List size={14} /></button>
          <button className="toolbar-btn" title="Numbered list"><List size={14} /></button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" title="Align left"><AlignLeft size={14} /></button>
          <button className="toolbar-btn" title="Align center"><AlignCenter size={14} /></button>
          <button className="toolbar-btn" title="Align right"><AlignRight size={14} /></button>
        </div>
      </div>

      <div className="compose-footer">
        <div className="compose-footer-left">
          {showSchedule ? (
            <div className="schedule-dropdown">
              {scheduleOptions.map((option) => (
                <button 
                  key={option.id} 
                  className="schedule-option"
                  onClick={() => handleSend(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSend}
                disabled={!to || !subject || isSending}
              >
                <Send size={16} />
                {isSending ? 'Sending...' : 'Send'}
              </Button>
              <button className="send-options-btn" title="Send options" onClick={() => setShowSchedule(!showSchedule)}>
                <ArrowDown size={16} />
              </button>
            </>
          )}
        </div>

        <div className="compose-footer-right">
          <button className="compose-toolbar-btn" title="Attach files">
            <Paperclip size={16} />
          </button>
          <button className="compose-toolbar-btn" title="Insert link">
            <Link size={16} />
          </button>
          <button className="compose-toolbar-btn" title="Insert image">
            <Image size={16} />
          </button>
          <div className="priority-selector">
            <button 
              className={`priority-btn ${priority}`} 
              onClick={() => setPriority(p => p === 'normal' ? 'high' : p === 'high' ? 'low' : 'normal')}
              title={`Priority: ${priority}`}
            >
              <Flag size={16} />
            </button>
          </div>
          <button 
            className="compose-toolbar-btn ai-assist" 
            onClick={() => setShowAiPanel(!showAiPanel)}
            title="AI Assist"
          >
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