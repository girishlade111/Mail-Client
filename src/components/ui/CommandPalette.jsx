import { useState, useEffect, useRef } from 'react';
import { Search, Inbox, Send, Star, Settings, User, Mail, Archive, Trash2, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUI } from '../../context/UIContext';
import './CommandPalette.css';

const commands = [
  { id: 'inbox', label: 'Go to Inbox', category: 'Navigation', icon: Inbox, action: 'navigate' },
  { id: 'sent', label: 'Go to Sent', category: 'Navigation', icon: Send, action: 'navigate' },
  { id: 'starred', label: 'Go to Starred', category: 'Navigation', icon: Star, action: 'navigate' },
  { id: 'archive', label: 'Go to Archive', category: 'Navigation', icon: Archive, action: 'navigate' },
  { id: 'trash', label: 'Go to Trash', category: 'Navigation', icon: Trash2, action: 'navigate' },
  { id: 'compose', label: 'Compose new email', category: 'Actions', icon: Mail, action: 'action' },
  { id: 'contacts', label: 'Go to Contacts', category: 'Navigation', icon: User, action: 'navigate' },
  { id: 'settings', label: 'Go to Settings', category: 'Navigation', icon: Settings, action: 'navigate' },
  { id: 'theme', label: 'Toggle theme', category: 'Settings', icon: Moon, action: 'theme' },
];

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const { theme, toggleTheme } = { theme: 'light', toggleTheme: () => {} };
  const { setActiveView, setComposeOpen } = { setActiveView: () => {}, setComposeOpen: () => {} };

  const filteredCommands = query
    ? commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

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
      toggleTheme();
    } else if (cmd.id === 'compose') {
      setComposeOpen(true);
    } else {
      setActiveView(cmd.id);
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
            placeholder="Type a command..."
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
                    <cmd.icon size={16} />
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
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}