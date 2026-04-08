import { useState } from 'react';
import { Tag, Folder, Category, Star, GripVertical, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
import { LabelsManager } from '../labels/LabelsManager';
import { CategoryManager } from '../mail/FilterChips';
import './OrganizationSettings.css';

export function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState('labels');

  const tabs = [
    { id: 'labels', label: 'Labels', icon: Tag },
    { id: 'categories', label: 'Categories', icon: Category },
    { id: 'folders', label: 'Folders', icon: Folder },
  ];

  return (
    <div className="organization-settings">
      <div className="org-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`org-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="org-content">
        {activeTab === 'labels' && <LabelsManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'folders' && <FolderManager />}
      </div>
    </div>
  );
}

function FolderManager() {
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: '📥', count: 142 },
    { id: 'sent', name: 'Sent', icon: '📤', count: 89 },
    { id: 'drafts', name: 'Drafts', icon: '📝', count: 12 },
    { id: 'starred', name: 'Starred', icon: '⭐', count: 23 },
    { id: 'archive', name: 'Archive', icon: '📦', count: 156 },
    { id: 'spam', name: 'Spam', icon: '⚠️', count: 3 },
    { id: 'trash', name: 'Trash', icon: '🗑️', count: 28 },
    { id: 'scheduled', name: 'Scheduled', icon: '📅', count: 5 },
  ];

  return (
    <div className="folder-manager">
      <div className="folder-header">
        <h3>Folders</h3>
        <span className="folder-desc">System folders that help organize your emails</span>
      </div>

      <div className="folder-list">
        {folders.map(folder => (
          <div key={folder.id} className="folder-item">
            <span className="folder-icon">{folder.icon}</span>
            <span className="folder-name">{folder.name}</span>
            <span className="folder-count">{folder.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}