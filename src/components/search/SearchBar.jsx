import { useState } from 'react';
import { Search, X, Filter, Calendar, User, Tag, Mail, Star, Clock, Image, File } from 'lucide-react';
import './SearchBar.css';

export function SearchBar({ value, onChange, onFocus, onBlur, onSubmit, placeholder = 'Search emails' }) {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChange?.('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit?.(value);
    }
    if (e.key === 'Escape') {
      onChange?.('');
      onBlur?.();
    }
  };

  return (
    <div className={`search-bar ${focused ? 'focused' : ''}`}>
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={handleClear}>
          <X size={16} />
        </button>
      )}
      {focused && (
        <div className="search-filters">
          <button className="search-filter-btn">
            <Filter size={14} />
            Filters
          </button>
        </div>
      )}
    </div>
  );
}

export function SearchDropdown({ onSelect, recentSearches = [] }) {
  const suggestions = [
    { type: 'filter', label: 'is:unread', description: 'Unread emails' },
    { type: 'filter', label: 'is:starred', description: 'Starred emails' },
    { type: 'filter', label: 'has:attachment', description: 'Emails with attachments' },
    { type: 'filter', label: 'from:me', description: 'Emails you sent' },
    { type: 'filter', label: 'label:work', description: 'Work label' },
  ];

  return (
    <div className="search-dropdown">
      {recentSearches.length > 0 && (
        <div className="search-dropdown-section">
          <div className="search-dropdown-header">Recent searches</div>
          {recentSearches.map((item, i) => (
            <button key={i} className="search-dropdown-item" onClick={() => onSelect(item)}>
              <Clock size={14} />
              <span>{item}</span>
            </button>
          ))}
        </div>
      )}
      <div className="search-dropdown-section">
        <div className="search-dropdown-header">Suggestions</div>
        {suggestions.map((item, i) => (
          <button key={i} className="search-dropdown-item" onClick={() => onSelect(item.label)}>
            {item.type === 'filter' ? <Filter size={14} /> : <Mail size={14} />}
            <div>
              <span className="suggestion-label">{item.label}</span>
              <span className="suggestion-desc">{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}