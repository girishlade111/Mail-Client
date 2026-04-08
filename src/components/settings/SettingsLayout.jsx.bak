import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, HardDrive, Key, Mail, Filter, Tag, Link2, Zap, Languages, Calendar, Moon, Sun } from 'lucide-react';
import { Switch } from '../ui';
import './Settings.css';

const settingsTabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'inbox', label: 'Inbox', icon: Mail },
  { id: 'accounts', label: 'Accounts', icon: User },
  { id: 'signatures', label: 'Signatures', icon: Edit },
  { id: 'filters', label: 'Filters', icon: Filter },
  { id: 'labels', label: 'Labels', icon: Tag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'storage', label: 'Storage', icon: HardDrive },
];

function Edit(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
}

export function SettingsLayout({ activeTab, onTabChange, children, onBack }) {
  return (
    <div className="settings-layout">
      <div className="settings-sidebar">
        <div className="settings-sidebar-header">
          {onBack && (
            <button className="settings-back-btn" onClick={onBack}>
              ← Back
            </button>
          )}
          <h2>Settings</h2>
        </div>
        <nav className="settings-nav">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="settings-content">
        {children}
      </div>
    </div>
  );
}

export function SettingsGeneral() {
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');
  const [undoDelay, setUndoDelay] = useState('10');
  const [conversationView, setConversationView] = useState(true);
  const [nudges, setNudges] = useState(true);

  return (
    <div className="settings-section">
      <h3>General Settings</h3>
      
      <div className="settings-group">
        <label className="settings-label">
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Timezone
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Undo send delay
          <select value={undoDelay} onChange={(e) => setUndoDelay(e.target.value)}>
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="20">20 seconds</option>
            <option value="30">30 seconds</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <Switch 
          checked={conversationView} 
          onChange={() => setConversationView(!conversationView)}
          label="Conversation view"
        />
      </div>

      <div className="settings-group">
        <Switch 
          checked={nudges} 
          onChange={() => setNudges(!nudges)}
          label="Nudges"
        />
      </div>
    </div>
  );
}

export function SettingsAppearance() {
  const { theme, toggleTheme } = { theme: 'light', toggleTheme: () => {} };
  const [density, setDensity] = useState('comfortable');
  const [readingPane, setReadingPane] = useState('right');
  const [fontSize, setFontSize] = useState('14');
  const [showSnippets, setShowSnippets] = useState(true);
  const [showAvatars, setShowAvatars] = useState(true);

  return (
    <div className="settings-section">
      <h3>Appearance</h3>
      
      <div className="settings-group">
        <label className="settings-label">Theme</label>
        <div className="theme-options">
          <button 
            className={`theme-option ${theme === 'light' ? 'active' : ''}`}
            onClick={toggleTheme}
          >
            <Sun size={20} />
            <span>Light</span>
          </button>
          <button 
            className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
            onClick={toggleTheme}
          >
            <Moon size={20} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Density
          <select value={density} onChange={(e) => setDensity(e.target.value)}>
            <option value="comfortable">Comfortable</option>
            <option value="cozy">Cozy</option>
            <option value="compact">Compact</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Reading pane
          <select value={readingPane} onChange={(e) => setReadingPane(e.target.value)}>
            <option value="right">Right</option>
            <option value="bottom">Bottom</option>
            <option value="off">Off</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Font size
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option value="12">Small</option>
            <option value="14">Medium</option>
            <option value="16">Large</option>
          </select>
        </label>
      </div>

      <div className="settings-group">
        <Switch 
          checked={showSnippets} 
          onChange={() => setShowSnippets(!showSnippets)}
          label="Show email snippets"
        />
      </div>

      <div className="settings-group">
        <Switch 
          checked={showAvatars} 
          onChange={() => setShowAvatars(!showAvippets)}
          label="Show avatars"
        />
      </div>
    </div>
  );
}

export function SettingsInbox() {
  const [categories, setCategories] = useState(true);
  const [importance, setImportance] = useState(true);
  const [inboxType, setInboxType] = useState('default');

  return (
    <div className="settings-section">
      <h3>Inbox Settings</h3>
      
      <div className="settings-group">
        <Switch 
          checked={categories} 
          onChange={() => setCategories(!categories)}
          label="Enable categories (Primary, Social, Updates, Promotions)"
        />
      </div>

      <div className="settings-group">
        <Switch 
          checked={importance} 
          onChange={() => setImportance(!importance)}
          label="Importance markers"
        />
      </div>

      <div className="settings-group">
        <label className="settings-label">
          Inbox type
          <select value={inboxType} onChange={(e) => setInboxType(e.target.value)}>
            <option value="default">Default</option>
            <option value="important">Important first</option>
            <option value="unread">Unread first</option>
            <option value="starred">Starred first</option>
            <option value="priority">Priority inbox</option>
          </select>
        </label>
      </div>
    </div>
  );
}