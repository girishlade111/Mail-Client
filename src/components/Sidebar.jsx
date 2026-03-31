import { Inbox, Send, File, AlertTriangle, Trash2, Star, Plus } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { Button } from './ui';
import './Sidebar.css';

const folderIcons = {
  inbox: Inbox,
  sent: Send,
  drafts: File,
  spam: AlertTriangle,
  trash: Trash2,
};

const folderLabels = {
  inbox: 'Inbox',
  sent: 'Sent',
  drafts: 'Drafts',
  spam: 'Spam',
  trash: 'Trash',
};

export function Sidebar({ isOpen, onClose }) {
  const { currentFolder, setCurrentFolder, allEmails } = useMail();

  const getUnreadCount = (folder) => {
    return allEmails.filter((email) => email.folder === folder && !email.read).length;
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h3>Folders</h3>
        </div>

        <nav className="sidebar-nav">
          {['inbox', 'sent', 'drafts', 'spam', 'trash'].map((folder) => {
            const Icon = folderIcons[folder];
            const unread = folder === 'inbox' ? getUnreadCount(folder) : 0;
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

        <div className="sidebar-section">
          <div className="sidebar-header">
            <h3>Starred</h3>
          </div>
          <button
            className={`sidebar-item ${currentFolder === 'starred' ? 'active' : ''}`}
            onClick={() => {
              setCurrentFolder('starred');
              onClose?.();
            }}
          >
            <Star size={18} />
            <span className="sidebar-label">Starred</span>
          </button>
        </div>

        <div className="compose-btn">
          <Button variant="primary" className="compose-btn-inner">
            <Plus size={18} />
            Compose
          </Button>
        </div>
      </aside>
    </>
  );
}