import { X, Keyboard } from 'lucide-react';
import './KeyboardShortcuts.css';

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { keys: ['g', 'i'], description: 'Go to Inbox' },
      { keys: ['g', 's'], description: 'Go to Starred' },
      { keys: ['g', 'd'], description: 'Go to Drafts' },
      { keys: ['g', 't'], description: 'Go to Sent' },
      { keys: ['g', 'a'], description: 'Go to All Mail' },
      { keys: ['g', 'c'], description: 'Go to Contacts' },
    ]
  },
  {
    category: 'Actions',
    items: [
      { keys: ['c'], description: 'Compose new email' },
      { keys: ['r'], description: 'Reply' },
      { keys: ['a'], description: 'Reply All' },
      { keys: ['f'], description: 'Forward' },
      { keys: ['e'], description: 'Archive' },
      { keys: ['#'], description: 'Delete' },
      { keys: ['!'], description: 'Mark as important' },
      { keys: ['s'], description: 'Toggle star' },
      { keys: ['u'], description: 'Mark as unread' },
    ]
  },
  {
    category: 'Selection',
    items: [
      { keys: ['x'], description: 'Select email' },
      { keys: ['*', 'a'], description: 'Select all' },
      { keys: ['*', 'n'], description: 'Deselect all' },
    ]
  },
  {
    category: 'Interface',
    items: [
      { keys: ['/'], description: 'Focus search' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Ctrl', 'k'], description: 'Command palette' },
      { keys: ['Esc'], description: 'Close dialog' },
    ]
  }
];

export function KeyboardShortcuts({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <div className="shortcuts-title">
            <Keyboard size={24} />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button className="shortcuts-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="shortcuts-content">
          {shortcuts.map((section) => (
            <div key={section.category} className="shortcuts-section">
              <h3>{section.category}</h3>
              <div className="shortcuts-list">
                {section.items.map((item, i) => (
                  <div key={i} className="shortcut-item">
                    <span className="shortcut-keys">
                      {item.keys.map((key, j) => (
                        <kbd key={j}>{key}</kbd>
                      ))}
                    </span>
                    <span className="shortcut-desc">{item.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          Press <kbd>?</kbd> to toggle this dialog
        </div>
      </div>
    </div>
  );
}