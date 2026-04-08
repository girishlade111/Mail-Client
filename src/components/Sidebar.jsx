import { useState } from 'react';
import { Inbox, Star, Clock, Send, File, Calendar, AlertTriangle, Trash2, Archive, User, Settings, Plus, ChevronDown, ChevronRight, Briefcase, Heart, DollarSign, Users, Package, Megaphone, AlertCircle, Tag, Search } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import { Button } from './ui';
import './Sidebar.css';

const folderIcons = {
  inbox: Inbox,
  starred: Star,
  snoozed: Clock,
  sent: Send,
  drafts: File,
  scheduled: Calendar,
  archive: Archive,
  spam: AlertTriangle,
  trash: Trash2,
};

const folderLabels = {
  inbox: 'Inbox',
  starred: 'Starred',
  snoozed: 'Snoozed',
  sent: 'Sent',
  drafts: 'Drafts',
  scheduled: 'Scheduled',
  archive: 'Archive',
  spam: 'Spam',
  trash: 'Trash',
};

const labelIcons = {
  work: Briefcase,
  personal: Heart,
  finance: DollarSign,
  clients: Users,
  team: Users,
  product: Package,
  marketing: Megaphone,
  urgent: AlertCircle,
};

export function Sidebar({ isOpen, onClose }) {
  const { currentFolder, setCurrentFolder, allEmails, labels } = useMail();
  const { openCompose, goToContacts, goToSearch, goToSettings } = useUI();
  const [labelsExpanded, setLabelsExpanded] = useState(true);

  const getUnreadCount = (folder) => {
    return allEmails.filter((email) => email.folder === folder && !email.read).length;
  };

  const getLabelCount = (labelId) => {
    return allEmails.filter((email) => email.labels.includes(labelId)).length;
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="compose-btn">
          <Button variant="primary" className="compose-btn-inner" onClick={openCompose}>
            <Plus size={18} />
            Compose
          </Button>
        </div>

        <nav className="sidebar-nav">
          {['inbox', 'starred', 'snoozed', 'sent', 'drafts', 'scheduled'].map((folder) => {
            const Icon = folderIcons[folder];
            const unread = getUnreadCount(folder);
            const isActive = currentFolder === folder;

            return (
              <button
                key={folder}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolder(folder);
                  onClose?.();
                }}
              >
                <Icon size={18} />
                <span className="sidebar-label">{folderLabels[folder]}</span>
                {unread > 0 && <span className="sidebar-badge">{unread}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          {['archive', 'spam', 'trash'].map((folder) => {
            const Icon = folderIcons[folder];
            const isActive = currentFolder === folder;

            return (
              <button
                key={folder}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setCurrentFolder(folder);
                  onClose?.();
                }}
              >
                <Icon size={18} />
                <span className="sidebar-label">{folderLabels[folder]}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-section">
          <button 
            className="sidebar-section-header"
            onClick={() => setLabelsExpanded(!labelsExpanded)}
          >
            {labelsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span>Labels</span>
          </button>
          
          {labelsExpanded && (
            <nav className="sidebar-nav">
              {labels.map((label) => {
                const Icon = labelIcons[label.id] || Tag;
                const count = getLabelCount(label.id);
                const isActive = currentFolder === `label-${label.id}`;

                return (
                  <button
                    key={label.id}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentFolder(`label-${label.id}`);
                      onClose?.();
                    }}
                  >
                    <span className="label-dot" style={{ backgroundColor: label.color }} />
                    <span className="sidebar-label">{label.name}</span>
                    {count > 0 && <span className="sidebar-badge">{count}</span>}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          <button className="sidebar-item" onClick={() => { goToContacts(); onClose?.(); }}>
            <User size={18} />
            <span className="sidebar-label">Contacts</span>
          </button>
          <button className="sidebar-item" onClick={() => { goToSearch(); onClose?.(); }}>
            <Search size={18} />
            <span className="sidebar-label">Search</span>
          </button>
          <button className="sidebar-item">
            <Calendar size={18} />
            <span className="sidebar-label">Calendar</span>
          </button>
          <button className="sidebar-item" onClick={() => { goToSettings(); onClose?.(); }}>
            <Settings size={18} />
            <span className="sidebar-label">Settings</span>
          </button>
        </nav>
      </aside>
    </>
  );
}