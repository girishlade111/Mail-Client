import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Minimize2, Maximize2, Send, Paperclip, MoreHorizontal, ArrowDown, 
  Sparkles, Clock, Flag, Trash2, Bold, Italic, Underline, List, Link, 
  Image, AlignLeft, AlignCenter, AlignRight, Quote, Highlighter, Type,
  Undo, Redo, FileText, User, Lock, Bell, Calendar, Check, AlertCircle,
  ChevronDown, Upload, XCircle, SparkleIcon
} from 'lucide-react';
import { Button, Avatar } from '../ui';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import './ComposeModal.css';

const signatures = [
  { id: 'sig-1', name: 'Default', content: 'Best regards,\nAlex Morgan\nSoftware Engineer\nFlowmail' },
  { id: 'sig-2', name: 'Formal', content: 'Sincerely,\nAlex Morgan\nSoftware Engineer' },
  { id: 'sig-3', name: 'Short', content: 'Best,\nAlex' },
];

const templates = [
  { id: 'tmpl-1', name: 'Meeting Request', subject: 'Meeting Request: {{topic}}', body: 'Hi {{name}},\n\nI would like to schedule a meeting to discuss {{topic}}.\n\nPlease let me know your availability.\n\nBest regards' },
  { id: 'tmpl-2', name: 'Project Update', subject: 'Project Update: {{project}}', body: 'Team,\n\nHere is the latest update on {{project}}:\n\n- Progress: {{progress}}\n- Next steps: {{next_steps}}\n\nPlease reach out if you have questions.' },
  { id: 'tmpl-3', name: 'Thank You', subject: 'Thank You', body: 'Hi {{name}},\n\nThank you for your help with {{topic}}. I really appreciate it!\n\nBest regards' },
];

export function ComposeModal({ isOpen, onClose, initialData, draftId, mode: initialMode }) {
  const { currentUser, sendEmail, accounts, labels } = useMail();
  const { addToast, drafts, setDrafts, activeDraftId, setActiveDraftId } = useUI();
  
  const [to, setTo] = useState(initialData?.to || '');
  const [cc, setCc] = useState(initialData?.cc || '');
  const [bcc, setBcc] = useState(initialData?.bcc || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [isMaximized, setIsMaximized] = useState(initialMode === 'fullscreen');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSignatures, setShowSignatures] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [priority, setPriority] = useState('normal');
  const [confidential, setConfidential] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [fromAccount, setFromAccount] = useState(accounts[0]?.email || currentUser.email);
  const [signature, setSignature] = useState('');
  const [scheduledTime, setScheduledTime] = useState(null);
  
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const autoSaveTimer = useRef(null);

  const draftKey = draftId || `draft-${Date.now()}`;

  useEffect(() => {
    if (initialData?.replyTo) {
      setTo(initialData.replyTo);
      if (initialData.subject) setSubject(initialData.subject);
      if (initialData.body) setBody(initialData.body);
    }
  }, [initialData]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      autoSaveTimer.current = setTimeout(() => {
        handleSaveDraft(true);
      }, 30000);
    }
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [to, subject, body, isOpen, isMinimized]);

  const handleSaveDraft = useCallback(async (isAutoSave = false) => {
    setIsSaving(true);
    
    const draft = {
      id: draftKey,
      to,
      cc,
      bcc,
      subject,
      body,
      from: fromAccount,
      priority,
      attachments,
      savedAt: new Date(),
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLastSaved(new Date());
    setIsSaving(false);
    if (!isAutoSave) {
      addToast('Draft saved');
    }
  }, [draftKey, to, cc, bcc, subject, body, fromAccount, priority, attachments, addToast]);

  const validateEmail = () => {
    const errors = {};
    if (!to.trim()) {
      errors.to = 'Recipient is required';
    }
    if (!subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!body.trim()) {
      errors.body = 'Message body is required';
    }
    return errors;
  };

  const handleSend = (scheduleType = 'now') => {
    const errors = validateEmail();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      addToast('Please fill in required fields', 'error');
      return;
    }

    setIsSending(true);
    setValidationErrors({});

    const sendWithDelay = (delay) => {
      setTimeout(() => {
        const newEmail = {
          id: `email-${Date.now()}`,
          threadId: `thread-${Date.now()}`,
          subject,
          body: body + (signature ? `\n\n---\n${signature}` : ''),
          from: { name: currentUser.name, email: fromAccount },
          to: [{ name: to, email: to }],
          cc: cc ? cc.split(',').map(e => ({ name: e.trim(), email: e.trim() })) : [],
          date: new Date(),
          read: true,
          starred: false,
          folder: 'sent',
          labels: [],
          priority,
        };
        
        sendEmail(newEmail);
        setIsSending(false);
        
        if (scheduleType === 'now') {
          addToast('Message sent');
        } else {
          addToast(`Scheduled for ${scheduleType}`);
        }
        onClose();
      }, delay);
    };

    if (scheduleType === 'now') {
      sendWithDelay(1000);
    } else {
      sendWithDelay(0);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
    }));

    setAttachments(prev => [...prev, ...newAttachments]);

    newAttachments.forEach(att => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setUploadProgress(prev => ({ ...prev, [att.id]: progress }));
      }, 200);
    });
  };

  const removeAttachment = (attId) => {
    setAttachments(prev => prev.filter(a => a.id !== attId));
    setUploadProgress(prev => {
      const next = { ...prev };
      delete next[attId];
      return next;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <FileText size={16} />;
    if (type.includes('image')) return <Image size={16} />;
    return <Paperclip size={16} />;
  };

  const insertSignature = (sig) => {
    setSignature(sig.content);
    setShowSignatures(false);
    addToast('Signature added');
  };

  const insertTemplate = (tmpl) => {
    setSubject(tmpl.subject.replace(/{{(\w+)}}/g, '$1'));
    setBody(tmpl.body.replace(/{{(\w+)}}/g, '[$1]'));
    setShowTemplates(false);
    addToast('Template inserted');
  };

  const applyFormatting = (format) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const formatActions = {
      bold: () => document.execCommand('bold', false, null),
      italic: () => document.execCommand('italic', false, null),
      underline: () => document.execCommand('underline', false, null),
      link: () => {
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
      },
      ul: () => document.execCommand('insertUnorderedList', false, null),
      ol: () => document.execCommand('insertOrderedList', false, null),
    };
    
    if (formatActions[format]) {
      formatActions[format]();
    }
  };

  const aiActions = [
    { id: 'rewrite', label: 'Rewrite', icon: '✏️', desc: 'Rewrite your message' },
    { id: 'shorten', label: 'Shorten', icon: '✂️', desc: 'Make it more concise' },
    { id: 'improve', label: 'Improve tone', icon: '📝', desc: 'Make it more professional' },
    { id: 'formal', label: 'Make formal', icon: '👔', desc: 'Convert to formal style' },
    { id: 'friendly', label: 'Make friendly', icon: '😊', desc: 'Convert to friendly style' },
    { id: 'summarize', label: 'Summarize', icon: '📋', desc: 'Shorten the content' },
  ];

  const handleAiAction = (actionId) => {
    setBody(prev => {
      const modifiers = {
        rewrite: 'Here is a rewritten version of your message:\n\n',
        shorten: 'Here is a shorter version:\n\n',
        improve: 'Here is an improved version with better tone:\n\n',
        formal: 'Here is a more formal version:\n\n',
        friendly: 'Here is a more friendly version:\n\n',
        summarize: 'Summary:\n\n',
      };
      return modifiers[actionId] + prev;
    });
    setShowAiPanel(false);
    addToast(`Applied ${actionId}`);
  };

  const handleDiscard = () => {
    if (to || subject || body) {
      if (confirm('Discard this draft?')) {
        onClose();
        addToast('Draft discarded');
      }
    } else {
      onClose();
    }
  };

  const handleMinimize = () => {
    handleSaveDraft(true);
    setIsMinimized(true);
  };

  if (!isOpen) return null;

  return (
    <div className={`compose-modal ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}>
      <div className="compose-header">
        <span className="compose-title">New Message</span>
        <div className="compose-header-actions">
          <button 
            className="compose-action-btn" 
            onClick={handleMinimize}
            title="Minimize to draft"
          >
            <Minimize2 size={16} />
          </button>
          <button 
            className="compose-action-btn" 
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Restore' : 'Fullscreen'}
          >
            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="compose-action-btn" onClick={handleDiscard} title="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="compose-body">
        <div className="compose-field from-field">
          <label className="compose-label">From</label>
          <div className="from-account-selector">
            <Avatar fallback={currentUser.name} size="sm" />
            <select 
              value={fromAccount} 
              onChange={(e) => setFromAccount(e.target.value)}
              className="account-select"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.email}>{acc.name} &lt;{acc.email}&gt;</option>
              ))}
            </select>
          </div>
        </div>

        <div className="compose-field">
          <label className="compose-label">To</label>
          <input
            type="text"
            className={`compose-input ${validationErrors.to ? 'error' : ''}`}
            value={to}
            onChange={(e) => { setTo(e.target.value); setValidationErrors(prev => ({...prev, to: null})); }}
            placeholder="Recipients"
          />
          {validationErrors.to && <span className="field-error">{validationErrors.to}</span>}
        </div>

        <div className="compose-cc-row">
          {!showCc && (
            <button className="compose-cc-toggle" onClick={() => setShowCc(true)}>
              Add Cc
            </button>
          )}
          {showCc && (
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
          
          {!showBcc && (
            <button className="compose-cc-toggle" onClick={() => setShowBcc(true)}>
              Add Bcc
            </button>
          )}
          {showBcc && (
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

        <div className="compose-options-row">
          <button 
            className={`option-toggle ${confidential ? 'active' : ''}`}
            onClick={() => setConfidential(!confidential)}
          >
            <Lock size={14} /> Confidential
          </button>
          <button 
            className={`option-toggle ${reminder ? 'active' : ''}`}
            onClick={() => setReminder(!reminder)}
          >
            <Bell size={14} /> Reminder
          </button>
        </div>

        <div className="compose-divider" />

        <div className="compose-field subject-field">
          <input
            type="text"
            className={`compose-input subject-input ${validationErrors.subject ? 'error' : ''}`}
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setValidationErrors(prev => ({...prev, subject: null})); }}
            placeholder="Subject"
          />
          {validationErrors.subject && <span className="field-error">{validationErrors.subject}</span>}
        </div>

        {attachments.length > 0 && (
          <div className="compose-attachments">
            {attachments.map(att => (
              <div key={att.id} className="attachment-chip">
                <span className="att-icon">{getFileIcon(att.type)}</span>
                <span className="att-name">{att.name}</span>
                <span className="att-size">{formatFileSize(att.size)}</span>
                {uploadProgress[att.id] < 100 ? (
                  <div className="upload-progress">
                    <div className="progress-bar" style={{ width: `${uploadProgress[att.id]}%` }} />
                  </div>
                ) : (
                  <button className="att-remove" onClick={() => removeAttachment(att.id)}>
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="compose-editor-container">
          <textarea
            ref={editorRef}
            className={`compose-editor ${validationErrors.body ? 'error' : ''}`}
            value={body}
            onChange={(e) => { setBody(e.target.value); setValidationErrors(prev => ({...prev, body: null})); }}
            placeholder="Write your message..."
          />
          {validationErrors.body && <span className="field-error body-error">{validationErrors.body}</span>}
        </div>

        {signature && (
          <div className="signature-preview">
            <span className="sig-label">Signature:</span>
            <pre className="sig-content">{signature}</pre>
          </div>
        )}
      </div>

      {showAiPanel && (
        <div className="compose-ai-panel">
          <div className="ai-panel-header">
            <Sparkles size={14} />
            <span>AI Assist</span>
            <button className="ai-panel-close" onClick={() => setShowAiPanel(false)}>×</button>
          </div>
          <div className="ai-options">
            {aiActions.map(action => (
              <button key={action.id} className="ai-option" onClick={() => handleAiAction(action.id)}>
                <span className="ai-option-icon">{action.icon}</span>
                <span className="ai-option-label">{action.label}</span>
                <span className="ai-option-desc">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="compose-toolbar">
        <div className="toolbar-group">
          <button className="toolbar-btn" onClick={() => applyFormatting('bold')} title="Bold (Ctrl+B)">
            <Bold size={16} />
          </button>
          <button className="toolbar-btn" onClick={() => applyFormatting('italic')} title="Italic (Ctrl+I)">
            <Italic size={16} />
          </button>
          <button className="toolbar-btn" onClick={() => applyFormatting('underline')} title="Underline (Ctrl+U)">
            <Underline size={16} />
          </button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" onClick={() => applyFormatting('link')} title="Insert link">
            <Link size={16} />
          </button>
          <button className="toolbar-btn" onClick={() => applyFormatting('ul')} title="Bullet list">
            <List size={16} />
          </button>
          <button className="toolbar-btn" onClick={() => applyFormatting('ol')} title="Numbered list">
            <List size={16} style={{ transform: 'rotate(0deg)' }} />
          </button>
          <span className="toolbar-divider" />
          <button className="toolbar-btn" title="Text color">
            <Type size={16} />
          </button>
          <button className="toolbar-btn" title="Highlight">
            <Highlighter size={16} />
          </button>
        </div>

        <div className="toolbar-right">
          <div className="dropdown-wrapper">
            <button className="toolbar-btn" onClick={() => setShowSignatures(!showSignatures)} title="Insert signature">
              <User size={16} />
            </button>
            {showSignatures && (
              <div className="dropdown-menu sig-menu">
                {signatures.map(sig => (
                  <button key={sig.id} className="dropdown-item" onClick={() => insertSignature(sig)}>
                    {sig.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-wrapper">
            <button className="toolbar-btn" onClick={() => setShowTemplates(!showTemplates)} title="Templates">
              <FileText size={16} />
            </button>
            {showTemplates && (
              <div className="dropdown-menu tmpl-menu">
                {templates.map(tmpl => (
                  <button key={tmpl.id} className="dropdown-item" onClick={() => insertTemplate(tmpl)}>
                    {tmpl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="compose-footer">
        <div className="compose-footer-left">
          {lastSaved && (
            <span className="save-indicator">
              <Check size={12} /> Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {isSaving && <span className="saving-indicator">Saving...</span>}
          
          {showSchedule ? (
            <div className="schedule-dropdown">
              {[
                { id: 'now', label: 'Send now' },
                { id: 'later_today', label: 'Later today (6 PM)' },
                { id: 'tomorrow', label: 'Tomorrow (9 AM)' },
                { id: 'next_week', label: 'Next week (Mon 9 AM)' },
              ].map(opt => (
                <button key={opt.id} className="schedule-option" onClick={() => handleSend(opt.id)}>
                  <Clock size={14} /> {opt.label}
                </button>
              ))}
              <button className="schedule-option custom" onClick={() => addToast('Custom schedule picker coming soon')}>
                <Calendar size={14} /> Pick date & time
              </button>
            </div>
          ) : (
            <>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => handleSend('now')}
                disabled={isSending}
              >
                <Send size={16} />
                {isSending ? 'Sending...' : 'Send'}
              </Button>
              <button className="send-options-btn" onClick={() => setShowSchedule(!showSchedule)}>
                <ChevronDown size={16} />
              </button>
            </>
          )}
        </div>

        <div className="compose-footer-right">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button className="compose-toolbar-btn" onClick={() => fileInputRef.current?.click()} title="Attach files">
            <Paperclip size={18} />
          </button>
          
          <div className="dropdown-wrapper">
            <button 
              className={`priority-btn ${priority}`}
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              title={`Priority: ${priority}`}
            >
              <Flag size={16} />
            </button>
            {showPriorityMenu && (
              <div className="dropdown-menu priority-menu">
                {['high', 'normal', 'low'].map(p => (
                  <button 
                    key={p} 
                    className={`dropdown-item ${priority === p ? 'active' : ''}`}
                    onClick={() => { setPriority(p); setShowPriorityMenu(false); }}
                  >
                    <Flag size={14} /> {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className={`compose-toolbar-btn ai-assist ${showAiPanel ? 'active' : ''}`}
            onClick={() => setShowAiPanel(!showAiPanel)}
            title="AI Assist"
          >
            <Sparkles size={18} />
          </button>

          <button 
            className="compose-toolbar-btn" 
            onClick={handleSaveDraft}
            title="Save draft"
          >
            <FileText size={18} />
          </button>

          <button className="compose-toolbar-btn" onClick={() => setShowMoreMenu(!showMoreMenu)} title="More">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}