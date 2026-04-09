import { useState } from 'react';
import { Settings, User, Bell, Palette, Shield, HardDrive, Key, Mail, Filter, Tag, Link2, Zap, Languages, Calendar, Moon, Sun, Edit, Clock, Inbox, FolderOpen, Plus, Monitor, Eye, EyeOff, Trash2, Check } from 'lucide-react';
import { Switch } from '../ui';
import { LabelsManager } from '../labels/LabelsManager';
import { CategoryManager } from '../mail/FilterChips';
import { RulesManager } from '../rules/RulesManager';
import { CompactShortcuts } from '../ui/CompactShortcuts';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import { useTheme } from '../../context/ThemeContext';
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
];

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
  const { languages, timezones, language, setLanguage, timezone, setTimezone, conversationView, setConversationView, sendArchiveEnabled, setSendArchiveEnabled, undoDuration, setUndoDuration, defaultReplyBehavior, setDefaultReplyBehavior, readingPanePosition, setReadingPanePosition, defaultInbox, setDefaultInbox } = useUI();

  return (
    <div className="settings-section">
      <h3>General Settings</h3>
      <p className="settings-description">Configure your basic preferences</p>

      <div className="settings-group">
        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Language</span>
            <span className="settings-option-desc">Select your preferred language</span>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="settings-select">
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Timezone</span>
            <span className="settings-option-desc">Set your local timezone</span>
          </div>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="settings-select">
            {timezones.map(tz => (
              <option key={tz.id} value={tz.id}>{tz.label}</option>
            ))}
          </select>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Default Inbox</span>
            <span className="settings-option-desc">Which inbox to show by default</span>
          </div>
          <select value={defaultInbox} onChange={(e) => setDefaultInbox(e.target.value)} className="settings-select">
            <option value="primary">Primary</option>
            <option value="social">Social</option>
            <option value="promotions">Promotions</option>
            <option value="updates">Updates</option>
          </select>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Reading Pane</span>
            <span className="settings-option-desc">Where to show message content</span>
          </div>
          <select value={readingPanePosition} onChange={(e) => setReadingPanePosition(e.target.value)} className="settings-select">
            <option value="right">Right side</option>
            <option value="bottom">Bottom</option>
            <option value="off">Off</option>
          </select>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Conversation View</span>
            <span className="settings-option-desc">Group related messages together</span>
          </div>
          <Switch checked={conversationView} onChange={setConversationView} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Send & Archive</span>
            <span className="settings-option-desc">Archive after sending a reply</span>
          </div>
          <Switch checked={sendArchiveEnabled} onChange={setSendArchiveEnabled} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Undo Send</span>
            <span className="settings-option-desc">Duration to undo sent messages</span>
          </div>
          <select value={undoDuration} onChange={(e) => setUndoDuration(parseInt(e.target.value))} className="settings-select">
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">60 seconds</option>
          </select>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Default Reply</span>
            <span className="settings-option-desc">Reply behavior for new messages</span>
          </div>
          <select value={defaultReplyBehavior} onChange={(e) => setDefaultReplyBehavior(e.target.value)} className="settings-select">
            <option value="reply">Reply</option>
            <option value="replyAll">Reply all</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function SettingsAppearance() {
  const { theme, setTheme, isDark, accentColors, accentColor, setAccentColor, fontSize, setFontSize } = useTheme();
  const { density, setDensity } = useUI();

  const themeModes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  const densities = [
    { id: 'compact', label: 'Compact' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'loose', label: 'Loose' },
  ];

  return (
    <div className="settings-section">
      <h3>Appearance</h3>
      <p className="settings-description">Customize the look and feel</p>

      <div className="settings-group">
        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Theme</span>
            <span className="settings-option-desc">Choose your color scheme</span>
          </div>
          <div className="theme-selector">
            {themeModes.map(mode => (
              <button
                key={mode.id}
                className={`theme-option ${theme === mode.id ? 'active' : ''}`}
                onClick={() => setTheme(mode.id)}
              >
                <mode.icon size={18} />
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Accent Color</span>
            <span className="settings-option-desc">Choose your accent color</span>
          </div>
          <div className="accent-selector">
            {accentColors.map(color => (
              <button
                key={color.id}
                className={`accent-option ${accentColor === color.id ? 'active' : ''}`}
                style={{ backgroundColor: color.color }}
                onClick={() => setAccentColor(color.id)}
                title={color.name}
              >
                {accentColor === color.id && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Font Size</span>
            <span className="settings-option-desc">Adjust text size</span>
          </div>
          <div className="density-selector">
            {densities.map(d => (
              <button
                key={d.id}
                className={`density-option ${fontSize === d.id ? 'active' : ''}`}
                onClick={() => setFontSize(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Density</span>
            <span className="settings-option-desc">Message list spacing</span>
          </div>
          <div className="density-selector">
            {densities.map(d => (
              <button
                key={d.id}
                className={`density-option ${density === d.id ? 'active' : ''}`}
                onClick={() => setDensity(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsInbox() {
  const { categoryTabsEnabled, setCategoryTabsEnabled, focusedInboxEnabled, setFocusedInboxEnabled, importanceMarkers, setImportanceMarkers, previewLines, setPreviewLines } = useUI();

  const previewOptions = [
    { value: 1, label: '1 line' },
    { value: 2, label: '2 lines' },
    { value: 3, label: '3 lines' },
  ];

  return (
    <div className="settings-section">
      <h3>Inbox Settings</h3>
      <p className="settings-description">Configure inbox behavior</p>

      <div className="settings-group">
        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Category Tabs</span>
            <span className="settings-option-desc">Show tabs for different categories</span>
          </div>
          <Switch checked={categoryTabsEnabled} onChange={setCategoryTabsEnabled} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Focused Inbox</span>
            <span className="settings-option-desc">Separate important emails</span>
          </div>
          <Switch checked={focusedInboxEnabled} onChange={setFocusedInboxEnabled} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Importance Markers</span>
            <span className="settings-option-desc">Show importance indicators</span>
          </div>
          <Switch checked={importanceMarkers} onChange={setImportanceMarkers} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Preview Lines</span>
            <span className="settings-option-desc">Number of preview lines</span>
          </div>
          <select value={previewLines} onChange={(e) => setPreviewLines(parseInt(e.target.value))} className="settings-select">
            {previewOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function SettingsAccounts() {
  const { accounts, activeAccountId } = useMail();
  
  return (
    <div className="settings-section">
      <h3>Accounts</h3>
      <p className="settings-description">Manage your connected accounts</p>

      <div className="settings-group">
        <div className="accounts-list">
          {accounts.map(account => (
            <div key={account.id} className={`settings-account-card ${activeAccountId === account.id ? 'active' : ''}`}>
              <div className="settings-account-header">
                <div className="settings-account-avatar" style={{ backgroundColor: account.color }}>
                  {account.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="settings-account-info">
                  <span className="settings-account-name">{account.name}</span>
                  <span className="settings-account-email">{account.email}</span>
                  <span className="settings-account-type">{account.type} • {account.provider}</span>
                </div>
                {account.isDefault && <span className="default-badge">Default</span>}
              </div>
              <div className="settings-account-storage">
                <div className="storage-bar">
                  <div className="storage-used" style={{ width: `${(account.storageUsed / account.storageTotal) * 100}%`, backgroundColor: account.color }} />
                </div>
                <span className="storage-text">{account.storageUsed} GB of {account.storageTotal} GB used</span>
              </div>
              <div className="settings-account-actions">
                <span className={`sync-status ${account.syncState}`}>
                  {account.syncState === 'synced' ? '✓ Synced' : account.syncState === 'syncing' ? '⟳ Syncing' : '⚠ Error'}
                </span>
                <button className="settings-action-btn">Send test</button>
              </div>
            </div>
          ))}
        </div>
        <button className="add-account-btn">
          <Plus size={16} /> Add account
        </button>
      </div>
    </div>
  );
}

export function SettingsSignatures() {
  const { accounts } = useMail();
  const [signatures, setSignatures] = useState(accounts.reduce((acc, account) => {
    acc[account.id] = { content: account.signature || '', isDefault: account.isDefault };
    return acc;
  }, {}));
  const [editingId, setEditingId] = useState(null);

  const handleSave = (accountId) => {
    setEditingId(null);
  };

  return (
    <div className="settings-section">
      <h3>Signatures</h3>
      <p className="settings-description">Create and manage email signatures</p>

      <div className="settings-group">
        {accounts.map(account => (
          <div key={account.id} className="signature-card">
            <div className="signature-header">
              <div className="signature-account">
                <div className="signature-avatar" style={{ backgroundColor: account.color }}>
                  {account.name.charAt(0)}
                </div>
                <div className="signature-account-info">
                  <span>{account.name}</span>
                  <span>{account.email}</span>
                </div>
              </div>
              <div className="signature-actions">
                <button 
                  className="signature-edit-btn"
                  onClick={() => setEditingId(editingId === account.id ? null : account.id)}
                >
                  {editingId === account.id ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>
            {editingId === account.id ? (
              <div className="signature-editor">
                <textarea
                  value={signatures[account.id]?.content || ''}
                  onChange={(e) => setSignatures(prev => ({
                    ...prev,
                    [account.id]: { ...prev[account.id], content: e.target.value }
                  }))}
                  placeholder="Enter your signature..."
                />
              </div>
            ) : (
              <div className="signature-preview">
                {signatures[account.id]?.content || <span className="no-signature">No signature set</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsFilters() {
  return (
    <div className="settings-section">
      <h3>Filters & Rules</h3>
      <p className="settings-description">Manage email filters and rules</p>
      <RulesManager />
    </div>
  );
}

export function SettingsNotifications() {
  const { desktopNotifications, setDesktopNotifications, notificationSound, setNotificationSound, remindersEnabled, setRemindersEnabled } = useUI();
  const [reminderTime, setReminderTime] = useState('60');

  return (
    <div className="settings-section">
      <h3>Notifications</h3>
      <p className="settings-description">Configure notification preferences</p>

      <div className="settings-group">
        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Desktop Notifications</span>
            <span className="settings-option-desc">Show desktop alerts for new emails</span>
          </div>
          <Switch checked={desktopNotifications} onChange={setDesktopNotifications} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Notification Sound</span>
            <span className="settings-option-desc">Play sound for new emails</span>
          </div>
          <Switch checked={notificationSound} onChange={setNotificationSound} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Email Reminders</span>
            <span className="settings-option-desc">Remind about unread emails</span>
          </div>
          <Switch checked={remindersEnabled} onChange={setRemindersEnabled} />
        </div>

        {remindersEnabled && (
          <div className="settings-option">
            <div className="settings-option-info">
              <span className="settings-option-label">Reminder Interval</span>
              <span className="settings-option-desc">How often to remind</span>
            </div>
            <select value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="settings-select">
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="1440">Daily</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingsShortcuts() {
  const { keyboardShortcuts, setKeyboardShortcuts } = useUI();

  return (
    <div className="settings-section">
      <h3>Keyboard Shortcuts</h3>
      <p className="settings-description">View and enable keyboard shortcuts</p>

      <div className="settings-group">
        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Enable Shortcuts</span>
            <span className="settings-option-desc">Use keyboard shortcuts</span>
          </div>
          <Switch checked={keyboardShortcuts} onChange={setKeyboardShortcuts} />
        </div>
      </div>

      {keyboardShortcuts && (
        <div className="shortcuts-list">
          <CompactShortcuts />
        </div>
      )}
    </div>
  );
}

export function SettingsLabels() {
  return (
    <div className="settings-section">
      <h3>Labels</h3>
      <p className="settings-description">Manage your labels</p>
      <LabelsManager />
    </div>
  );
}

export function SettingsOrganization() {
  const [activeTab, setActiveTab] = useState('labels');
  
  return (
    <div className="settings-section">
      <h3>Organization</h3>
      <p className="settings-description">Configure labels and categories</p>
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

export function SettingsPrivacy() {
  const { externalImagesWarning, setExternalImagesWarning, trackingPixelWarning, setTrackingPixelWarning, downloadWarning, setDownloadWarning } = useUI();
  const [blockedSenders, setBlockedSenders] = useState([]);

  return (
    <div className="settings-section">
      <h3>Privacy & Security</h3>
      <p className="settings-description">Configure privacy and security settings</p>

      <div className="settings-group">
        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">External Images Warning</span>
            <span className="settings-option-desc">Warn before loading external images</span>
          </div>
          <Switch checked={externalImagesWarning} onChange={setExternalImagesWarning} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Tracking Pixel Warning</span>
            <span className="settings-option-desc">Warn about email tracking pixels</span>
          </div>
          <Switch checked={trackingPixelWarning} onChange={setTrackingPixelWarning} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Download Warning</span>
            <span className="settings-option-desc">Confirm before downloading attachments</span>
          </div>
          <Switch checked={downloadWarning} onChange={setDownloadWarning} />
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <span className="settings-option-label">Blocked Senders</span>
            <span className="settings-option-desc">Manage blocked email addresses</span>
          </div>
          <div className="blocked-senders">
            {blockedSenders.length === 0 ? (
              <span className="empty-text">No blocked senders</span>
            ) : (
              <div className="blocked-list">
                {blockedSenders.map(sender => (
                  <div key={sender} className="blocked-item">
                    <span>{sender}</span>
                    <button onClick={() => setBlockedSenders(prev => prev.filter(s => s !== sender))}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button className="add-blocked-btn">
              <Plus size={14} /> Add sender
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}