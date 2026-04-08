import { useMemo, useState } from 'react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth, subDays } from 'date-fns';
import { Search, Clock, X, Filter, ArrowDownUp, AlertCircle } from 'lucide-react';
import { MailRow } from '../MailRow';
import { SearchChips } from './SearchChips';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import './SearchResults.css';

export function SearchResults({ searchResults, searchQuery, onBack, onEmailSelect }) {
  const { searchState, clearSearch, searchHistory, quickFilterResults, setShowAdvancedSearch } = useMail();
  const { addToast } = useUI();
  const [sortBy, setSortBy] = useState('relevance');
  const [isLoading, setIsLoading] = useState(false);
  
  const hasFilters = useMemo(() => {
    return Object.keys(searchState).some(key => {
      const value = searchState[key];
      if (key === 'query') return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'boolean') return value;
      return value !== '' && value !== null;
    });
  }, [searchState]);

  const groupedResults = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return {};
    
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    };
    
    searchResults.forEach(email => {
      const date = new Date(email.date);
      if (isToday(date)) {
        groups.today.push(email);
      } else if (isYesterday(date)) {
        groups.yesterday.push(email);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(email);
      } else if (isThisMonth(date)) {
        groups.thisMonth.push(email);
      } else {
        groups.older.push(email);
      }
    });
    
    return groups;
  }, [searchResults]);

  const sortedResults = useMemo(() => {
    if (!searchResults) return [];
    let results = [...searchResults];
    
    if (sortBy === 'date_newest') {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'date_oldest') {
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    
    return results;
  }, [searchResults, sortBy]);

  const groupLabels = {
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    thisMonth: 'This month',
    older: 'Older'
  };

  const handleClearAll = () => {
    clearSearch();
    addToast('Search cleared');
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  if (isLoading) {
    return (
      <div className="search-results-container">
        <div className="search-loading">
          <div className="loading-spinner" />
          <p>Searching...</p>
        </div>
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-empty">
          <Search size={48} className="empty-icon" />
          <h3>No results found</h3>
          <p>Try adjusting your search terms or filters</p>
          
          {searchHistory.length > 0 && (
            <div className="recent-searches">
              <h4>Recent searches</h4>
              <div className="recent-list">
                {searchHistory.slice(0, 5).map(item => (
                  <button 
                    key={item.id} 
                    className="recent-item"
                    onClick={() => {
                      // Re-apply search
                    }}
                  >
                    <Clock size={14} />
                    <span>{item.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button 
            className="advanced-btn"
            onClick={() => setShowAdvancedSearch(true)}
          >
            <Filter size={16} /> Advanced search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <div className="results-info">
          <h2>Search Results</h2>
          <span className="results-count">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} 
            {searchQuery && ` for "${searchQuery}"`}
          </span>
        </div>
        
        <div className="results-actions">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="relevance">Relevance</option>
            <option value="date_newest">Newest first</option>
            <option value="date_oldest">Oldest first</option>
          </select>
          
          <button 
            className="filter-btn"
            onClick={() => setShowAdvancedSearch(true)}
          >
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      <SearchChips 
        onClearAll={handleClearAll}
        onSave={() => {
          addToast('Search saved');
        }}
      />

      <div className="search-results-content">
        {Object.entries(groupedResults).map(([group, emails]) => {
          if (emails.length === 0) return null;
          
          return (
            <div key={group} className="results-group">
              <div className="group-header">
                <span>{groupLabels[group]}</span>
                <span className="group-count">{emails.length}</span>
              </div>
              <div className="group-results">
                {emails.map(email => (
                  <MailRow
                    key={email.id}
                    email={email}
                    isSelected={false}
                    onClick={() => onEmailSelect?.(email)}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {searchResults.length > 50 && (
        <div className="results-pagination">
          <span>Showing 1-{Math.min(50, searchResults.length)} of {searchResults.length}</span>
        </div>
      )}
    </div>
  );
}