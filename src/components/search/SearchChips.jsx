import { X, User, Tag, Calendar, Paperclip, Star, Flag, FileText } from 'lucide-react';
import { useMail } from '../../context/MailContext';
import './SearchChips.css';

export function SearchChips({ onEdit, onRemove, onClearAll, onSave, onSaveAsDefault }) {
  const { searchState, clearSearch, labels } = useMail();
  
  const chips = [];
  
  if (searchState.query) {
    chips.push({ id: 'query', label: 'Search', value: searchState.query, icon: FileText });
  }
  if (searchState.from) {
    chips.push({ id: 'from', label: 'From', value: searchState.from, icon: User });
  }
  if (searchState.to) {
    chips.push({ id: 'to', label: 'To', value: searchState.to, icon: User });
  }
  if (searchState.subject) {
    chips.push({ id: 'subject', label: 'Subject', value: searchState.subject, icon: FileText });
  }
  if (searchState.hasWords) {
    chips.push({ id: 'hasWords', label: 'Has words', value: searchState.hasWords, icon: FileText });
  }
  if (searchState.excludeWords) {
    chips.push({ id: 'excludeWords', label: 'Exclude', value: searchState.excludeWords, icon: FileText });
  }
  if (searchState.hasAttachment) {
    chips.push({ id: 'hasAttachment', label: 'Has attachment', value: 'Yes', icon: Paperclip });
  }
  if (searchState.labels.length > 0) {
    const labelNames = searchState.labels.map(l => {
      const found = labels.find(label => label.id === l);
      return found ? found.name : l;
    }).join(', ');
    chips.push({ id: 'labels', label: 'Labels', value: labelNames, icon: Tag });
  }
  if (searchState.folder) {
    chips.push({ id: 'folder', label: 'Folder', value: searchState.folder, icon: Tag });
  }
  if (searchState.category) {
    chips.push({ id: 'category', label: 'Category', value: searchState.category, icon: Tag });
  }
  if (searchState.dateRange) {
    const dateLabels = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'this_week': 'This week',
      'this_month': 'This month',
      'older': 'Older'
    };
    chips.push({ id: 'dateRange', label: 'Date', value: dateLabels[searchState.dateRange] || searchState.dateRange, icon: Calendar });
  }
  if (searchState.isRead !== null) {
    chips.push({ id: 'isRead', label: 'Status', value: searchState.isRead ? 'Read' : 'Unread', icon: FileText });
  }
  if (searchState.isStarred !== null) {
    chips.push({ id: 'isStarred', label: 'Starred', value: searchState.isStarred ? 'Yes' : 'No', icon: Star });
  }
  if (searchState.importance) {
    chips.push({ id: 'importance', label: 'Importance', value: searchState.importance, icon: Flag });
  }

  if (chips.length === 0) {
    return null;
  }

  const handleRemoveChip = (chipId) => {
    if (onRemove) {
      onRemove(chipId);
    } else {
      if (chipId === 'query') clearSearch();
    }
  };

  return (
    <div className="search-chips">
      <div className="chips-list">
        {chips.map(chip => (
          <div key={chip.id} className="search-chip" onClick={() => onEdit?.(chip.id)}>
            <span className="chip-icon">
              <chip.icon size={12} />
            </span>
            <span className="chip-label">{chip.label}:</span>
            <span className="chip-value">{chip.value}</span>
            <button 
              className="chip-remove" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveChip(chip.id);
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="chips-actions">
        {onSave && (
          <button className="chip-action-btn" onClick={onSave}>
            <Star size={12} /> Save
          </button>
        )}
        {onSaveAsDefault && (
          <button className="chip-action-btn" onClick={onSaveAsDefault}>
            <Tag size={12} /> Save as default
          </button>
        )}
        {onClearAll && chips.length > 0 && (
          <button className="chip-action-btn clear-all" onClick={onClearAll}>
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}