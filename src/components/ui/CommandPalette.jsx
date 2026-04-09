import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Inbox, Send, Star, Settings, User, Mail, Archive, Trash2, Moon, Tag, Folder, Pencil, ArrowRight, CheckSquare, AlertCircle } from 'lucide-react';
import { useMail } from '../../context/MailContext';
import './CommandPalette.css';

export function CommandPalette({ open, onClose, onNavigate, onCompose, onToggleTheme }) {
  const { labels, accounts, setCurrentFolder, setCurrentView, activeAccountId } = useMail();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => [
    { id: 'inbox', label: 'Go to Inbox', category: 'Navigation', icon: Inbox },
    { id: 'sent', label: 'Go to Sent', category: 'Navigation', icon: Send },
    { id: 'starred', label: 'Go to Starred', category: 'Navigation', icon: Star },
    { id: 'archive', label: 'Go to Archive', category: 'Navigation', icon: Archive },
    { id: 'trash', label: 'Go to Trash', category: 'Navigation', icon: Trash2 },
    { id: 'drafts', label: 'Go to Drafts', category: 'Navigation', icon: Pencil },
    { id: 'spam', label: 'Go to Spam', category: 'Navigation', icon: AlertCircle },
    { id: '/compose', label: 'Compose new email', category: 'Actions', icon: Mail },
    { id: 'reply', label: 'Reply to sender', category: 'Actions', icon: ArrowRight },
    { id: 'forward', label: 'Forward email', category: 'Actions', icon: ArrowRight },
    { id: 'archive-selection', label: 'Archive selected', category: 'Actions', icon: Archive },
    { id: 'delete-selection', label: 'Delete selected', category: 'Actions', icon: Trash2 },
    { id: 'star-selection', label: 'Star selected', category: 'Actions', icon: Star },
    { id: 'unread-selection', label: 'Mark as unread', category: 'Actions', icon: CheckSquare },
    { id: 'contacts', label: 'Go to Contacts', category: 'Navigation', icon: User },
    { id: 'settings', label: 'Go to Settings', category: 'Navigation', icon: Settings },
    { id: 'theme', label: 'Toggle theme', category: 'Settings', icon: Moon },
    ...labels.map(label => ({
      id: `label-${label.id}`,
      label: `Label: ${label.name}`,
      category: 'Labels',
      icon: Tag,
      color: label.color
    })),
    ...accounts.map(account => ({
      id: `account-${account.id}`,
      label: `Switch to ${account.name}`,
      category: 'Accounts',
      icon: User,
      color: account.color
    }))
  ], [labels, accounts]);

  const filteredCommands = query
    ? commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce((acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = [];
      acc[cmd.category].push(cmd);
      return acc;
    }, {});
  }, [filteredCommands]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filteredCommands[selectedIndex];
      if (cmd) executeCommand(cmd);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeCommand = (cmd) => {
    if (cmd.id === 'theme') {
      onToggleTheme?.();
    } else if (cmd.id === '/compose' || cmd.id === 'compose') {
      onCompose?.();
    } else if (cmd.id.startsWith('label-')) {
      // Label navigation handled below
    } else if (cmd.id.startsWith('account-')) {
      // Account switch handled below
    } else if (['inbox', 'sent', 'starred', 'archive', 'trash', 'drafts', 'spam'].includes(cmd.id)) {
      setCurrentFolder(cmd.id);
      onNavigate?.(cmd.id);
    } else if (cmd.id === 'contacts') {
      setCurrentView('contacts');
      onNavigate?.('contacts');
    } else if (cmd.id === 'settings') {
      setCurrentView('settings');
      onNavigate?.('settings');
    }
    onClose();
  };

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-header">
          <Search size={18} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="command-input"
          />
        </div>
        
        <div className="command-list">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="command-group">
              <div className="command-category">{category}</div>
              {cmds.map((cmd) => {
                const currentIndex = flatIndex++;
                return (
                  <button
                    key={cmd.id}
                    className={`command-item ${currentIndex === selectedIndex ? 'selected' : ''}`}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                  >
                    <cmd.icon size={16} style={cmd.color ? { color: cmd.color } : {}} />
                    <span>{cmd.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="no-results">No commands found</div>
          )}
        </div>
        
        <div className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Select</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}