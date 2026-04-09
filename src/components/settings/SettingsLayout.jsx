import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, HardDrive, Key, Mail, Filter, Tag, Link2, Zap, Languages, Calendar, Moon, Sun, Edit, Clock, Inbox, FolderOpen, Plus } from 'lucide-react';
import { Switch } from '../ui';
import { LabelsManager } from '../labels/LabelsManager';
import { CategoryManager } from '../mail/FilterChips';
import { RulesManager } from '../rules/RulesManager';
import { useMail } from '../../context/MailContext';
import './Settings.css';

const settingsTabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'accounts', label: 'Accounts', icon: User },
  { id: 'signatures', label: 'Signatures', icon: Edit },
  { id: 'filters', label: 'Filters', icon: Filter },
  { id: 'labels', label: 'Labels', icon: Tag },
  { id: 'organization', label: 'Organization', icon: FolderOpen },
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
  const { accounts, activeAccountId, switchAccount, getActiveAccount, setAccounts } = useMail();
  
  return (
    <div className="settings-section">
      <h3>Accounts</h3>
      <div className="accounts-list">
        {accounts.map(account => (
          <div key={account.id} className={`account-card ${activeAccountId === account.id ? 'active' : ''}`}>
            <div className="account-card-header">
              <div className="account-card-avatar" style={{ backgroundColor: account.color }}>
                {account.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="account-card-info">
                <span className="account-card-name">{account.name}</span>
                <span className="account-card-email">{account.email}</span>
                <span className="account-card-type">{account.type} • {account.provider}</span>
              </div>
              {account.isDefault && <span className="default-badge">Default</span>}
            </div>
            <div className="account-card-storage">
              <div className="storage-bar">
                <div className="storage-used" style={{ width: `${(account.storageUsed / account.storageTotal) * 100}%`, backgroundColor: account.color }} />
              </div>
              <span className="storage-text">{account.storageUsed} GB of {account.storageTotal} GB used</span>
            </div>
            <div className="account-card-footer">
              <span className={`sync-status ${account.syncState}`}>
                {account.syncState === 'synced' ? '✓ Synced' : account.syncState === 'syncing' ? '⟳ Syncing' : '⚠ Error'}
              </span>
              <div className="account-card-actions">
                <button className="account-action-btn">Edit</button>
                {!account.isDefault && <button className="account-action-btn danger">Remove</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="add-account-btn">
        <Plus size={16} /> Add account
      </button>
    </div>
  );
}

export function SettingsSignatures() {
  return <div className="settings-section"><h3>Signatures</h3></div>;
}

export function SettingsFilters() {
  return (
    <div className="settings-section">
      <h3>Filters & Rules</h3>
      <RulesManager />
    </div>
  );
}

export function SettingsNotifications() {
  return <div className="settings-section"><h3>Notifications</h3></div>;
}

export function SettingsShortcuts() {
  return <div className="settings-section"><h3>Keyboard Shortcuts</h3></div>;
}

export function SettingsLabels() {
  return (
    <div className="settings-section">
      <h3>Labels</h3>
      <LabelsManager />
    </div>
  );
}

export function SettingsOrganization() {
  const [activeTab, setActiveTab] = useState('labels');
  
  return (
    <div className="settings-section">
      <h3>Organization</h3>
      <div className="org-tabs">
        <button 
          className={`org-tab ${activeTab === 'labels' ? 'active' : ''}`}
          onClick={() => setActiveTab('labels')}
        >
          <Tag size={16} /> Labels
        </button>
        <button 
          className={`org-tab ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Inbox size={16} /> Categories
        </button>
      </div>
      <div className="org-content">
        {activeTab === 'labels' && <LabelsManager />}
        {activeTab === 'categories' && <CategoryManager />}
      </div>
    </div>
  );
}
