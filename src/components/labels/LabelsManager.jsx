import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronRight, ChevronDown, GripVertical, Tag, X } from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import { Modal } from '../ui/Modal';
import './LabelsManager.css';

const LABEL_COLORS = [
  '#4361ee', '#3b82f6', '#06b6d4', '#14b8a6',
  '#22c55e', '#84cc16', '#eab308', '#f59e0b',
  '#f97316', '#ef4444', '#ec4899', '#8b5cf6',
];

export function LabelsManager() {
  const { labels, createLabel, updateLabel, deleteLabel, toggleLabelVisibility, reorderLabels } = useMail();
  const { addToast } = useUI();
  
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#4361ee');
  const [newParentId, setNewParentId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [expandedLabels, setExpandedLabels] = useState(new Set());
  
  const rootLabels = useMemo(() => {
    return labels.filter(l => !l.parentId).sort((a, b) => a.order - b.order);
  }, [labels]);
  
  const getChildLabels = (parentId) => {
    return labels.filter(l => l.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const handleAddLabel = () => {
    if (!newLabelName.trim()) {
      addToast('Please enter a label name', 'error');
      return;
    }
    createLabel(newLabelName, newLabelColor, newParentId);
    addToast(`Label "${newLabelName}" created`);
    resetModal();
  };

  const handleUpdateLabel = () => {
    if (!newLabelName.trim() || !editingLabel) return;
    updateLabel(editingLabel.id, { name: newLabelName, color: newLabelColor, parentId: newParentId });
    addToast(`Label updated`);
    resetModal();
  };

  const handleDeleteLabel = (labelId) => {
    deleteLabel(labelId);
    addToast('Label deleted');
    setShowDeleteConfirm(null);
  };

  const handleEditLabel = (label) => {
    setEditingLabel(label);
    setNewLabelName(label.name);
    setNewLabelColor(label.color);
    setNewParentId(label.parentId);
    setShowModal(true);
  };

  const handleToggleVisibility = (labelId) => {
    toggleLabelVisibility(labelId);
  };

  const resetModal = () => {
    setShowModal(false);
    setEditingLabel(null);
    setNewLabelName('');
    setNewLabelColor('#4361ee');
    setNewParentId(null);
  };

  const toggleExpand = (labelId) => {
    setExpandedLabels(prev => {
      const next = new Set(prev);
      if (next.has(labelId)) {
        next.delete(labelId);
      } else {
        next.add(labelId);
      }
      return next;
    });
  };

  const renderLabelItem = (label, isChild = false) => {
    const children = getChildLabels(label.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedLabels.has(label.id);

    return (
      <div key={label.id} className={`label-item ${isChild ? 'label-item-child' : ''}`}>
        <div className="label-drag">
          <GripVertical size={14} />
        </div>
        
        {hasChildren && !isChild && (
          <button className="label-expand" onClick={() => toggleExpand(label.id)}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
        
        {!hasChildren || isChild ? <div className="label-expand-spacer" /> : null}
        
        <div className="label-color" style={{ backgroundColor: label.color }} />
        
        <div className="label-info">
          <span className="label-name">{label.name}</span>
          <span className="label-count">{label.emailCount || 0}</span>
        </div>
        
        <div className="label-actions">
          <button 
            onClick={() => handleToggleVisibility(label.id)} 
            title={label.visible ? 'Hide in sidebar' : 'Show in sidebar'}
          >
            {label.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button onClick={() => handleEditLabel(label)} title="Edit">
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(label.id)} 
            title="Delete"
            className="delete-action"
          >
            <Trash2 size={14} />
          </button>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="label-children">
            {children.map(child => renderLabelItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="labels-manager">
      <div className="labels-header">
        <h3>Labels</h3>
        <button className="add-label-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Create label
        </button>
      </div>

      <div className="labels-list">
        {rootLabels.length === 0 ? (
          <div className="labels-empty">
            <Tag size={24} />
            <p>No labels yet</p>
            <span>Create your first label to organize emails</span>
          </div>
        ) : (
          rootLabels.map(label => renderLabelItem(label))
        )}
      </div>

      <Modal 
        open={showModal} 
        onClose={resetModal}
        title={editingLabel ? 'Edit Label' : 'Create Label'}
        size="sm"
      >
        <div className="label-editor">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="Label name"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label>Color</label>
            <div className="color-grid">
              {LABEL_COLORS.map(color => (
                <button
                  key={color}
                  className={`color-option ${newLabelColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewLabelColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Parent label (optional)</label>
            <select 
              value={newParentId || ''} 
              onChange={(e) => setNewParentId(e.target.value || null)}
            >
              <option value="">None (top-level)</option>
              {labels
                .filter(l => !l.parentId && l.id !== editingLabel?.id)
                .map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))
              }
            </select>
          </div>
          
          <div className="modal-actions">
            <button className="cancel-btn" onClick={resetModal}>Cancel</button>
            <button 
              className="save-btn" 
              onClick={editingLabel ? handleUpdateLabel : handleAddLabel}
            >
              {editingLabel ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Delete Label"
        size="sm"
      >
        <div className="delete-confirm">
          <p>Are you sure you want to delete this label?</p>
          <span>This will remove the label from all emails. This action cannot be undone.</span>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
            <button 
              className="delete-btn-confirm" 
              onClick={() => handleDeleteLabel(showDeleteConfirm)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}