import { useState, useRef, useEffect } from 'react';
import { Tag, Plus, Search, Check } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import './LabelPicker.css';

export function LabelPicker({ 
  emailId, 
  selectedLabels = [], 
  onLabelToggle, 
  onLabelAdd,
  multiple = false,
  emailIds = [],
  mode = 'dropdown'
}) {
  const { labels, addLabelToEmail, removeLabelFromEmail, addLabelToMultiple, removeLabelFromMultiple, createLabel, allEmails } = useMail();
  const { addToast } = useUI();
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#4361ee');
  
  const pickerRef = useRef(null);
  
  const LABEL_COLORS = [
    '#4361ee', '#3b82f6', '#06b6d4', '#22c55e',
    '#eab308', '#f59e0b', '#f97316', '#ef4444',
    '#ec4899', '#8b5cf6',
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleLabels = labels.filter(l => 
    l.visible && l.name.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.order - b.order);

  const filteredLabels = search 
    ? visibleLabels 
    : visibleLabels.filter(l => !l.parentId);

  const getChildLabels = (parentId) => {
    return visibleLabels.filter(l => l.parentId === parentId);
  };

  const checkEmailHasLabel = (emailId, labelId) => {
    const email = allEmails.find(e => e.id === emailId);
    return email?.labels?.includes(labelId) || false;
  };

  const isLabelSelected = (labelId) => {
    if (multiple && emailIds && emailIds.length > 0) {
      return emailIds.every(id => checkEmailHasLabel(id, labelId));
    }
    return selectedLabels.includes(labelId);
  };

  const handleToggle = (labelId) => {
    if (multiple && emailIds && emailIds.length > 0) {
      const allSelected = emailIds.every(id => checkEmailHasLabel(id, labelId));
      
      if (allSelected) {
        removeLabelFromMultiple(emailIds, labelId);
        addToast('Label removed');
      } else {
        addLabelToMultiple(emailIds, labelId);
        addToast('Label added');
      }
    } else if (emailId) {
      if (selectedLabels.includes(labelId)) {
        removeLabelFromEmail(emailId, labelId);
        addToast('Label removed');
      } else {
        addLabelToEmail(emailId, labelId);
        addToast('Label added');
      }
    }
    
    onLabelToggle?.(labelId);
  };

  const handleCreate = () => {
    if (!newLabelName.trim()) {
      addToast('Please enter a label name', 'error');
      return;
    }
    const newLabel = createLabel(newLabelName, newLabelColor, null);
    addToast(`Label "${newLabelName}" created`);
    
    if (emailId && !selectedLabels.includes(newLabel.id)) {
      addLabelToEmail(emailId, newLabel.id);
      onLabelAdd?.(newLabel.id);
    }
    
    setNewLabelName('');
    setNewLabelColor('#4361ee');
    setShowCreate(false);
  };

  const getLabelColor = (labelId) => {
    const label = labels.find(l => l.id === labelId);
    return label?.color || '#6b7280';
  };

  const getLabelName = (labelId) => {
    const label = labels.find(l => l.id === labelId);
    return label?.name || labelId;
  };

  if (mode === 'display') {
    const displayLabels = selectedLabels.slice(0, 3).map(id => ({
      id,
      color: getLabelColor(id),
      name: getLabelName(id),
    }));
    const overflow = selectedLabels.length - 3;

    return (
      <div className="label-display">
        {displayLabels.map(label => (
          <span 
            key={label.id} 
            className="label-chip"
            style={{ backgroundColor: label.color + '20', borderColor: label.color }}
            title={label.name}
          >
            <span className="label-dot" style={{ backgroundColor: label.color }} />
            <span className="label-name">{label.name}</span>
          </span>
        ))}
        {overflow > 0 && (
          <span className="label-overflow">+{overflow}</span>
        )}
      </div>
    );
  }

  return (
    <div className="label-picker" ref={pickerRef}>
      {mode === 'button' ? (
        <button 
          className="label-picker-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Tag size={14} />
          Labels
          {selectedLabels.length > 0 && (
            <span className="label-count">{selectedLabels.length}</span>
          )}
        </button>
      ) : (
        <div className="label-trigger" onClick={() => setIsOpen(!isOpen)}>
          <Tag size={14} />
        </div>
      )}
      
      {isOpen && (
        <div className="label-dropdown">
          <div className="label-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search labels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="label-list">
            {filteredLabels.length === 0 ? (
              <div className="label-empty">No labels found</div>
            ) : (
              filteredLabels.map(label => {
                const children = getChildLabels(label.id);
                const hasChildren = children.length > 0;
                const isSelected = isLabelSelected(label.id);
                
                return (
                  <div key={label.id}>
                    <button
                      className={`label-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggle(label.id)}
                    >
                      <span className="label-color" style={{ backgroundColor: label.color }} />
                      <span className="label-name">{label.name}</span>
                      {isSelected && <Check size={14} className="check-icon" />}
                    </button>
                    
                    {hasChildren && children.map(child => {
                      const childSelected = isLabelSelected(child.id);
                      
                      return (
                        <button
                          key={child.id}
                          className={`label-option label-option-child ${childSelected ? 'selected' : ''}`}
                          onClick={() => handleToggle(child.id)}
                        >
                          <span className="label-color" style={{ backgroundColor: child.color }} />
                          <span className="label-name">{child.name}</span>
                          {childSelected && <Check size={14} className="check-icon" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="label-create-section">
            {showCreate ? (
              <div className="label-create-form">
                <input
                  type="text"
                  placeholder="Label name"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  autoFocus
                />
                <div className="label-colors">
                  {LABEL_COLORS.map(color => (
                    <button
                      key={color}
                      className={`label-color-btn ${newLabelColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    />
                  ))}
                </div>
                <div className="label-create-actions">
                  <button onClick={() => setShowCreate(false)}>Cancel</button>
                  <button className="create-btn" onClick={handleCreate}>Create</button>
                </div>
              </div>
            ) : (
              <button className="label-create-btn" onClick={() => setShowCreate(true)}>
                <Plus size={14} />
                Create new label
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}