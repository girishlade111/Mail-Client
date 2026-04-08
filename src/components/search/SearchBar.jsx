import { useState, useRef, useEffect } from 'react';
import { 
  Search, X, Clock, Star as StarIcon, TrendingUp, Filter, 
  Paperclip, Inbox, Tag, Calendar, User, FileText, Trash2
} from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { SearchPanel } from './SearchPanel';
import './SearchBar.css';

export function SearchBar({ value, onChange, onFocus, onBlur, onSubmit, placeholder = 'Search emails' }) {
  const [focused, setFocused] = useState(false);
  const {
    searchHistory, clearSearchHistory,
    savedSearches, deleteSavedSearch,
    quickFilterResults,
    applySearch, clearSearch,
    showAdvancedSearch, setShowAdvancedSearch
  } = useMail();
  
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
        onBlur?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

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
    clearSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (value?.trim()) {
        applySearch({ query: value });
        onSubmit?.(value);
      }
    }
    if (e.key === 'Escape') {
      onChange?.('');
      setFocused(false);
      onBlur?.();
    }
  };

  const handleQuickFilter = (filterId) => {
    const results = quickFilterResults(filterId);
    if (results.length > 0) {
      onChange?.(filterId);
      applySearch({ query: filterId });
      setFocused(false);
      onSubmit?.(filterId);
    }
  };

  const quickFilters = [
    { id: 'unread', label: 'Unread', icon: User, count: quickFilterResults('unread').length },
    { id: 'starred', label: 'Starred', icon: StarIcon, count: quickFilterResults('starred').length },
    { id: 'attachments', label: 'Has attachments', icon: Paperclip, count: quickFilterResults('attachments').length },
    { id: 'important', label: 'Important', icon: FileText, count: quickFilterResults('important').length },
  ];

  const searchOperators = [
    { label: 'label:', example: 'label:work' },
    { label: 'from:', example: 'from:sarah' },
    { label: 'to:', example: 'to:mike' },
    { label: 'has:attachment', example: 'has:attachment' },
    { label: 'is:unread', example: 'is:unread' },
    { label: 'is:starred', example: 'is:starred' },
  ];

  return (
    <div className={`search-bar-wrapper ${focused ? 'focused' : ''}`} ref={searchRef}>
      <div className="search-bar">
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
          <button 
            className="search-filter-btn"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            title="Advanced search"
          >
            <Filter size={14} />
          </button>
        )}
      </div>

      {showAdvancedSearch && (
        <SearchPanel onClose={() => setShowAdvancedSearch(false)} />
      )}

      {focused && !value && (
        <div className="search-dropdown">
          <div className="dropdown-section">
            <div className="dropdown-header">
              <span>Quick filters</span>
            </div>
            {quickFilters.map(filter => (
              <button 
                key={filter.id} 
                className="dropdown-item"
                onClick={() => handleQuickFilter(filter.id)}
              >
                <filter.icon size={14} />
                <span>{filter.label}</span>
                <span className="filter-count">{filter.count}</span>
              </button>
            ))}
          </div>

          {searchHistory.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-header">
                <span>Recent searches</span>
                <button className="clear-btn" onClick={clearSearchHistory}>
                  <Trash2 size={12} /> Clear
                </button>
              </div>
              {searchHistory.slice(0, 5).map(item => (
                <button 
                  key={item.id} 
                  className="dropdown-item"
                  onClick={() => {
                    onChange?.(item.query);
                    applySearch({ query: item.query });
                    setFocused(false);
                  }}
                >
                  <Clock size={14} />
                  <span>{item.query}</span>
                </button>
              ))}
            </div>
          )}

          <div className="dropdown-section">
            <div className="dropdown-header">
              <span>Search operators</span>
            </div>
            <div className="operators-list">
              {searchOperators.map(op => (
                <span 
                  key={op.label} 
                  className="operator-chip"
                  onClick={() => {
                    onChange?.(op.example);
                  }}
                >
                  {op.example}
                </span>
              ))}
            </div>
          </div>

          {savedSearches.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-header">
                <span>Saved searches</span>
              </div>
              {savedSearches.map(search => (
                <button 
                  key={search.id} 
                  className="dropdown-item"
                  onClick={() => {
                    applySearch(search.searchState);
                    setFocused(false);
                  }}
                >
                  <StarIcon size={14} />
                  <span>{search.name}</span>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSavedSearch(search.id);
                    }}
                  >
                    <X size={12} />
                  </button>
                </button>
              ))}
            </div>
          )}
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
            <Filter size={14} />
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