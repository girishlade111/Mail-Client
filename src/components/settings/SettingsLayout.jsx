import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, HardDrive, Key, Mail, Filter, Tag, Link2, Zap, Languages, Calendar, Moon, Sun, Edit, Clock, Inbox } from 'lucide-react';
import { Switch } from '../ui';
import './Settings.css';

const settingsTabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'accounts', label: 'Accounts', icon: User },
  { id: 'signatures', label: 'Signatures', icon: Edit },
  { id: 'filters', label: 'Filters', icon: Filter },
  { id: 'labels', label: 'Labels', icon: Tag },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shortcuts', label: 'Shortcuts', icon: Clock },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'storage', label: 'Storage', icon: HardDrive },
];

export function SettingsLayout({ activeTab, onTabChange, children, onBack }) {
  return (
    <div className="settings-layout">
      <div className="settings-sidebar">
        <div className="settings-sidebar-header">
          {onBack && (
            <button className="settings-back-btn" onClick={onBack}>
              Back
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
  return (
    <div className="settings-section">
      <h3>General Settings</h3>
      <div className="settings-group">
        <label className="settings-label">
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export function SettingsAppearance() {
  return <div className="settings-section"><h3>Appearance</h3></div>;
}

export function SettingsInbox() {
  return <div className="settings-section"><h3>Inbox Settings</h3></div>;
}

export function SettingsAccounts() {
  return <div className="settings-section"><h3>Accounts</h3></div>;
}

export function SettingsSignatures() {
  return <div className="settings-section"><h3>Signatures</h3></div>;
}

export function SettingsFilters() {
  return <div className="settings-section"><h3>Filters</h3></div>;
}

export function SettingsNotifications() {
  return <div className="settings-section"><h3>Notifications</h3></div>;
}

export function SettingsShortcuts() {
  return <div className="settings-section"><h3>Keyboard Shortcuts</h3></div>;
}
