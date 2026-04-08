import { ArrowUpDown, ArrowDown, ArrowUp, Star, Paperclip, AlignJustify, List, Menu, MessageSquare, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import './InboxHeader.css';

const sortOptions = [
  { id: 'newest', label: 'Newest', icon: ArrowDown },
  { id: 'oldest', label: 'Oldest', icon: ArrowUp },
  { id: 'unread', label: 'Unread first', icon: MessageSquare },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'attachments', label: 'Has attachments', icon: Paperclip },
];

const densityOptions = [
  { id: 'compact', label: 'Compact' },
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'expanded', label: 'Expanded' },
];

export function InboxHeader({ totalCount, selectedCount, allSelected, onSelectAll, onClearSelection, onMarkAllRead }) {
  const { sortOrder, setSortOrder, density, setDensity, conversationView, setConversationView } = useMail();
  const { addToast } = useUI();
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const sortRef = useRef(null);
  const densityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
      if (densityRef.current && !densityRef.current.contains(e.target)) {
        setShowDensityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSort = sortOptions.find(o => o.id === sortOrder) || sortOptions[0];
  const currentDensity = densityOptions.find(o => o.id === density) || densityOptions[1];

  return (
    <div className="inbox-header">
      <div className="inbox-header-left">
        {selectedCount > 0 ? (
          <div className="selection-info">
            <button className="clear-selection-btn" onClick={onClearSelection}>
              <Check size={16} />
            </button>
            <span className="selected-text">{selectedCount} selected</span>
            <button className="select-all-btn" onClick={onSelectAll}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>
        ) : (
          <label className="select-all-checkbox" onClick={onSelectAll}>
            <input type="checkbox" checked={allSelected} onChange={() => {}} />
            <span className="checkbox-custom">
              {allSelected && <Check size={12} />}
            </span>
          </label>
        )}
        
        {selectedCount === 0 && (
          <button className="mark-all-read-btn" onClick={onMarkAllRead} title="Mark all as read">
            <MessageSquare size={16} />
          </button>
        )}
      </div>

      <div className="inbox-header-right">
        <div className="header-dropdown" ref={sortRef}>
          <button 
            className="dropdown-trigger"
            onClick={() => setShowSortMenu(!showSortMenu)}
          >
            <currentSort.icon size={14} />
            <span>{currentSort.label}</span>
          </button>
          
          {showSortMenu && (
            <div className="dropdown-menu">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  className={`dropdown-item ${sortOrder === option.id ? 'active' : ''}`}
                  onClick={() => {
                    setSortOrder(option.id);
                    setShowSortMenu(false);
                    addToast(`Sorted by ${option.label}`);
                  }}
                >
                  <option.icon size={14} />
                  <span>{option.label}</span>
                  {sortOrder === option.id && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="header-dropdown" ref={densityRef}>
          <button 
            className="dropdown-trigger density-trigger"
            onClick={() => setShowDensityMenu(!showDensityMenu)}
            title="Density"
          >
            {density === 'compact' ? (
              <AlignJustify size={16} />
            ) : density === 'comfortable' ? (
              <List size={16} />
            ) : (
              <Menu size={16} />
            )}
          </button>
          
          {showDensityMenu && (
            <div className="dropdown-menu density-menu">
              {densityOptions.map((option) => (
                <button
                  key={option.id}
                  className={`dropdown-item ${density === option.id ? 'active' : ''}`}
                  onClick={() => {
                    setDensity(option.id);
                    setShowDensityMenu(false);
                  }}
                >
                  <span>{option.label}</span>
                  {density === option.id && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          className={`view-toggle ${conversationView ? 'active' : ''}`}
          onClick={() => setConversationView(!conversationView)}
          title={conversationView ? 'Conversation view on' : 'Conversation view off'}
        >
          <MessageSquare size={16} />
        </button>
      </div>
    </div>
  );
}