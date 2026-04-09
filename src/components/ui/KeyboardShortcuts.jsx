import { useState } from 'react';
import { X, Keyboard, Search, ChevronRight } from 'lucide-react';
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
    category: 'Message Actions',
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
    category: 'Selection & Movement',
    items: [
      { keys: ['x'], description: 'Select message' },
      { keys: ['*', 'a'], description: 'Select all' },
      { keys: ['n'], description: 'Next message' },
      { keys: ['p'], description: 'Previous message' },
      { keys: ['j'], description: 'Next message' },
      { keys: ['k'], description: 'Previous message' },
      { keys: ['Enter'], description: 'Open message' },
    ]
  },
  {
    category: 'Interface',
    items: [
      { keys: ['/'], description: 'Focus search' },
      { keys: ['?'], description: 'Show shortcuts' },
      { keys: ['Ctrl', 'k'], description: 'Command palette' },
      { keys: ['Esc'], description: 'Close / Clear selection' },
    ]
  }
];

export function KeyboardShortcuts({ open, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredShortcuts = shortcuts.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

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
        
        <div className="shortcuts-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="shortcuts-categories">
          <button 
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {shortcuts.map(section => (
            <button 
              key={section.category}
              className={`category-btn ${activeCategory === section.category ? 'active' : ''}`}
              onClick={() => setActiveCategory(section.category)}
            >
              {section.category}
            </button>
          ))}
        </div>
        
        <div className="shortcuts-content">
          {(activeCategory === 'all' ? filteredShortcuts : filteredShortcuts.filter(s => s.category === activeCategory)).map((section) => (
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
          <span>Press <kbd>?</kbd> to toggle this dialog</span>
          <span className="footer-sep">|</span>
          <span><kbd>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}