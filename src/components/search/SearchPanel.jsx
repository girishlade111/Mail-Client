import { useState } from 'react';
import { 
  Search, X, Filter, ChevronDown, ChevronUp, Calendar, 
  FileText, Tag, Folder, Inbox, User, Paperclip, Star, 
  Flag, Clock, Save, RotateCcw, AlertCircle
} from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import './SearchPanel.css';

export function SearchPanel({ onClose }) {
  const { labels, searchState, setSearchState, applySearch, clearSearch, saveSearch, accounts } = useMail();
  const { addToast } = useUI();
  const [expandedSection, setExpandedSection] = useState('basic');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const [localState, setLocalState] = useState({
    from: searchState.from || '',
    to: searchState.to || '',
    subject: searchState.subject || '',
    hasWords: searchState.hasWords || '',
    excludeWords: searchState.excludeWords || '',
    hasAttachment: searchState.hasAttachment || false,
    labels: searchState.labels || [],
    folder: searchState.folder || '',
    category: searchState.category || '',
    dateRange: searchState.dateRange || '',
    isRead: searchState.isRead ?? null,
    isStarred: searchState.isStarred ?? null,
    importance: searchState.importance || '',
  });

  const updateField = (field, value) => {
    setLocalState(prev => ({ ...prev, [field]: value }));
  };

  const toggleLabel = (labelId) => {
    setLocalState(prev => ({
      ...prev,
      labels: prev.labels.includes(labelId)
        ? prev.labels.filter(l => l !== labelId)
        : [...prev.labels, labelId]
    }));
  };

  const handleApply = () => {
    applySearch({ ...searchState, ...localState });
    addToast('Search filters applied');
    onClose?.();
  };

  const handleClear = () => {
    setLocalState({
      from: '', to: '', subject: '', hasWords: '', excludeWords: '',
      hasAttachment: false, labels: [], folder: '', category: '',
      dateRange: '', isRead: null, isStarred: null, importance: ''
    });
    clearSearch();
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      addToast('Please enter a name for this search', 'error');
      return;
    }
    saveSearch(saveName, { ...searchState, ...localState });
    addToast('Search saved');
    setShowSaveDialog(false);
    setSaveName('');
  };

  const sections = [
    { id: 'basic', label: 'Basic', icon: Search },
    { id: 'sender', label: 'Sender', icon: User },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'status', label: 'Status', icon: Filter },
    { id: 'advanced', label: 'Advanced', icon: AlertCircle },
  ];

  return (
    <div className="search-panel">
      <div className="search-panel-header">
        <h3>Advanced Search</h3>
        <button className="close-btn" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="search-panel-sections">
        {sections.map(section => (
          <div key={section.id} className={`section-item ${expandedSection === section.id ? 'expanded' : ''}`}>
            <button 
              className="section-header"
              onClick={() => setExpandedSection(expandedSection === section.id ? '' : section.id)}
            >
              <section.icon size={16} />
              <span>{section.label}</span>
              {expandedSection === section.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {expandedSection === section.id && (
              <div className="section-content">
                {section.id === 'basic' && (
                  <>
                    <div className="field-group">
                      <label>Subject</label>
                      <input
                        type="text"
                        value={localState.subject}
                        onChange={(e) => updateField('subject', e.target.value)}
                        placeholder="Contains in subject"
                      />
                    </div>
                    <div className="field-group">
                      <label>Has the words</label>
                      <input
                        type="text"
                        value={localState.hasWords}
                        onChange={(e) => updateField('hasWords', e.target.value)}
                        placeholder="Keywords in message"
                      />
                    </div>
                    <div className="field-group">
                      <label>Doesn't have</label>
                      <input
                        type="text"
                        value={localState.excludeWords}
                        onChange={(e) => updateField('excludeWords', e.target.value)}
                        placeholder="Exclude keywords"
                      />
                    </div>
                    <div className="field-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={localState.hasAttachment}
                          onChange={(e) => updateField('hasAttachment', e.target.checked)}
                        />
                        <Paperclip size={14} />
                        Has attachments
                      </label>
                    </div>
                  </>
                )}

                {section.id === 'sender' && (
                  <>
                    <div className="field-group">
                      <label>From</label>
                      <input
                        type="text"
                        value={localState.from}
                        onChange={(e) => updateField('from', e.target.value)}
                        placeholder="Sender email or name"
                      />
                    </div>
                    <div className="field-group">
                      <label>To</label>
                      <input
                        type="text"
                        value={localState.to}
                        onChange={(e) => updateField('to', e.target.value)}
                        placeholder="Recipient email or name"
                      />
                    </div>
                  </>
                )}

                {section.id === 'content' && (
                  <>
                    <div className="field-group">
                      <label>Folder</label>
                      <select
                        value={localState.folder}
                        onChange={(e) => updateField('folder', e.target.value)}
                      >
                        <option value="">Any</option>
                        <option value="inbox">Inbox</option>
                        <option value="sent">Sent</option>
                        <option value="drafts">Drafts</option>
                        <option value="archive">Archive</option>
                        <option value="trash">Trash</option>
                        <option value="spam">Spam</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Label</label>
                      <div className="label-list">
                        {labels.map(label => (
                          <label key={label.id} className="label-checkbox">
                            <input
                              type="checkbox"
                              checked={localState.labels.includes(label.id)}
                              onChange={() => toggleLabel(label.id)}
                            />
                            <span className="label-dot" style={{ backgroundColor: label.color }} />
                            {label.name}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="field-group">
                      <label>Category</label>
                      <select
                        value={localState.category}
                        onChange={(e) => updateField('category', e.target.value)}
                      >
                        <option value="">Any</option>
                        <option value="primary">Primary</option>
                        <option value="social">Social</option>
                        <option value="updates">Updates</option>
                        <option value="promotions">Promotions</option>
                        <option value="forums">Forums</option>
                        <option value="team">Team</option>
                      </select>
                    </div>
                  </>
                )}

                {section.id === 'date' && (
                  <>
                    <div className="field-group">
                      <label>Date within</label>
                      <select
                        value={localState.dateRange}
                        onChange={(e) => updateField('dateRange', e.target.value)}
                      >
                        <option value="">Any time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="this_week">This week</option>
                        <option value="this_month">This month</option>
                        <option value="older">Older</option>
                      </select>
                    </div>
                  </>
                )}

                {section.id === 'status' && (
                  <>
                    <div className="field-group">
                      <label>Read status</label>
                      <div className="toggle-group">
                        <button
                          className={`toggle-btn ${localState.isRead === null ? 'active' : ''}`}
                          onClick={() => updateField('isRead', null)}
                        >
                          Any
                        </button>
                        <button
                          className={`toggle-btn ${localState.isRead === true ? 'active' : ''}`}
                          onClick={() => updateField('isRead', true)}
                        >
                          Read
                        </button>
                        <button
                          className={`toggle-btn ${localState.isRead === false ? 'active' : ''}`}
                          onClick={() => updateField('isRead', false)}
                        >
                          Unread
                        </button>
                      </div>
                    </div>
                    <div className="field-group">
                      <label>Starred</label>
                      <div className="toggle-group">
                        <button
                          className={`toggle-btn ${localState.isStarred === null ? 'active' : ''}`}
                          onClick={() => updateField('isStarred', null)}
                        >
                          Any
                        </button>
                        <button
                          className={`toggle-btn ${localState.isStarred === true ? 'active' : ''}`}
                          onClick={() => updateField('isStarred', true)}
                        >
                          <Star size={14} /> Starred
                        </button>
                      </div>
                    </div>
                    <div className="field-group">
                      <label>Importance</label>
                      <select
                        value={localState.importance}
                        onChange={(e) => updateField('importance', e.target.value)}
                      >
                        <option value="">Any</option>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </>
                )}

                {section.id === 'advanced' && (
                  <>
                    <div className="field-group">
                      <label>Sorted by</label>
                      <select>
                        <option value="relevance">Relevance</option>
                        <option value="date_newest">Date (newest first)</option>
                        <option value="date_oldest">Date (oldest first)</option>
                      </select>
                    </div>
                    <div className="field-group">
                      <label>Search in</label>
                      <select>
                        <option value="all">All mail</option>
                        <option value="current">Current folder</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="search-panel-footer">
        <button className="btn-secondary" onClick={handleClear}>
          <RotateCcw size={14} /> Clear
        </button>
        <button className="btn-secondary" onClick={() => setShowSaveDialog(true)}>
          <Save size={14} /> Save
        </button>
        <button className="btn-primary" onClick={handleApply}>
          <Search size={14} /> Search
        </button>
      </div>

      {showSaveDialog && (
        <div className="save-dialog-overlay">
          <div className="save-dialog">
            <h4>Save Search</h4>
            <input
              type="text"
              placeholder="Search name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <div className="dialog-actions">
              <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}