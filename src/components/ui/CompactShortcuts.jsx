import './KeyboardShortcuts.css';

const shortcuts = [
  {
    category: 'Navigation',
    items: [
      { keys: ['g', 'i'], description: 'Go to Inbox' },
      { keys: ['g', 's'], description: 'Go to Starred' },
      { keys: ['g', 'd'], description: 'Go to Drafts' },
      { keys: ['g', 't'], description: 'Go to Sent' },
    ]
  },
  {
    category: 'Actions',
    items: [
      { keys: ['c'], description: 'Compose' },
      { keys: ['r'], description: 'Reply' },
      { keys: ['a'], description: 'Reply All' },
      { keys: ['f'], description: 'Forward' },
      { keys: ['e'], description: 'Archive' },
      { keys: ['#'], description: 'Delete' },
      { keys: ['s'], description: 'Toggle star' },
      { keys: ['u'], description: 'Mark unread' },
    ]
  },
  {
    category: 'Interface',
    items: [
      { keys: ['/'], description: 'Search' },
      { keys: ['?'], description: 'Shortcuts help' },
      { keys: ['Ctrl', 'k'], description: 'Command palette' },
    ]
  }
];

export function CompactShortcuts() {
  return (
    <div className="compact-shortcuts">
      {shortcuts.map((section) => (
        <div key={section.category} className="shortcuts-section">
          <h3 className="shortcuts-section-title">{section.category}</h3>
          <div className="shortcuts-grid">
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
  );
}