import { useState } from 'react';
import { Plus, Edit2, Trash2, MoreHorizontal, Tag } from 'lucide-react';
import { labels as initialLabels } from '../../data/mock';
import { Modal } from '../ui/Modal';
import './LabelsManager.css';

export function LabelsManager() {
  const [labels, setLabels] = useState(initialLabels);
  const [showModal, setShowModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#4361ee');

  const colors = [
    '#4361ee', '#3b82f6', '#06b6d4', '#14b8a6',
    '#22c55e', '#84cc16', '#eab308', '#f59e0b',
    '#f97316', '#ef4444', '#ec4899', '#8b5cf6',
  ];

  const handleAddLabel = () => {
    if (!newLabelName.trim()) return;
    
    const label = {
      id: `label-${Date.now()}`,
      name: newLabelName,
      color: newLabelColor,
      emailCount: 0,
    };
    
    setLabels([...labels, label]);
    setNewLabelName('');
    setNewLabelColor('#4361ee');
    setShowModal(false);
  };

  const handleDeleteLabel = (id) => {
    setLabels(labels.filter(l => l.id !== id));
  };

  const handleEditLabel = (label) => {
    setEditingLabel(label);
    setNewLabelName(label.name);
    setNewLabelColor(label.color);
    setShowModal(true);
  };

  const handleUpdateLabel = () => {
    if (!newLabelName.trim() || !editingLabel) return;
    
    setLabels(labels.map(l => 
      l.id === editingLabel.id 
        ? { ...l, name: newLabelName, color: newLabelColor }
        : l
    ));
    setEditingLabel(null);
    setNewLabelName('');
    setNewLabelColor('#4361ee');
    setShowModal(false);
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
        {labels.map(label => (
          <div key={label.id} className="label-item">
            <div className="label-color" style={{ backgroundColor: label.color }} />
            <span className="label-name">{label.name}</span>
            <span className="label-count">{label.emailCount}</span>
            <div className="label-actions">
              <button onClick={() => handleEditLabel(label)} title="Edit">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDeleteLabel(label.id)} title="Delete">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setEditingLabel(null);
          setNewLabelName('');
          setNewLabelColor('#4361ee');
        }}
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
            />
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="color-grid">
              {colors.map(color => (
                <button
                  key={color}
                  className={`color-option ${newLabelColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewLabelColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            <button 
              className="save-btn" 
              onClick={editingLabel ? handleUpdateLabel : handleAddLabel}
            >
              {editingLabel ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}