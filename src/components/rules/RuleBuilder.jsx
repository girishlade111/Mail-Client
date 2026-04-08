import { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle, Eye } from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import { Modal } from '../ui/Modal';
import './RuleBuilder.css';

const CONDITION_FIELDS = [
  { id: 'from', label: 'From', operators: ['contains', 'equals'] },
  { id: 'to', label: 'To', operators: ['contains', 'equals'] },
  { id: 'subject', label: 'Subject', operators: ['contains', 'equals'] },
  { id: 'body', label: 'Body', operators: ['contains'] },
  { id: 'hasAttachment', label: 'Has attachment', operators: ['is'] },
  { id: 'size', label: 'Size', operators: ['greaterThan', 'lessThan'] },
  { id: 'read', label: 'Read status', operators: ['is'] },
  { id: 'starred', label: 'Starred', operators: ['is'] },
  { id: 'priority', label: 'Priority', operators: ['is'] },
  { id: 'category', label: 'Category', operators: ['is'] },
  { id: 'label', label: 'Label', operators: ['is'] },
  { id: 'senderDomain', label: 'Sender domain', operators: ['contains', 'equals'] },
];

const ACTION_TYPES = [
  { id: 'label', label: 'Apply label' },
  { id: 'move', label: 'Move to folder' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete' },
  { id: 'markRead', label: 'Mark read' },
  { id: 'markUnread', label: 'Mark unread' },
  { id: 'markImportant', label: 'Mark important' },
  { id: 'star', label: 'Add star' },
  { id: 'snooze', label: 'Snooze' },
  { id: 'category', label: 'Set category' },
  { id: 'flag', label: 'Flag for follow-up' },
];

const SIZE_OPTIONS = ['1', '5', '10', '25', '50'];
const PRIORITY_OPTIONS = ['high', 'normal', 'low'];
const CATEGORY_OPTIONS = ['primary', 'social', 'updates', 'promotions', 'forums', 'team'];
const FOLDER_OPTIONS = ['inbox', 'sent', 'drafts', 'archive', 'spam', 'trash'];

export function RuleBuilder({ rule, onClose }) {
  const { createRule, updateRule, labels, getMatchingEmailsForRule } = useMail();
  const { addToast } = useUI();

  const [name, setName] = useState(rule?.name || '');
  const [matchAll, setMatchAll] = useState(rule?.matchAll ?? false);
  const [conditions, setConditions] = useState(rule?.conditions || []);
  const [actions, setActions] = useState(rule?.actions || []);
  const [showPreview, setShowPreview] = useState(false);

  const addCondition = () => {
    setConditions([...conditions, { field: 'subject', operator: 'contains', value: '', not: false }]);
  };

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index, field, value) => {
    setConditions(conditions.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const addAction = () => {
    setActions([...actions, { type: 'label', value: '' }]);
  };

  const removeAction = (index) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index, field, value) => {
    setActions(actions.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const handleSave = () => {
    if (!name.trim()) {
      addToast('Please enter a rule name', 'error');
      return;
    }
    if (conditions.length === 0) {
      addToast('Please add at least one condition', 'error');
      return;
    }
    if (actions.length === 0) {
      addToast('Please add at least one action', 'error');
      return;
    }

    const ruleData = {
      name,
      matchAll,
      conditions: conditions.filter(c => c.value.trim()),
      actions: actions.filter(a => a.value),
    };

    if (rule) {
      updateRule(rule.id, ruleData);
      addToast('Rule updated');
    } else {
      createRule(ruleData);
      addToast('Rule created');
    }
    onClose();
  };

  const matchingCount = rule ? getMatchingEmailsForRule(rule.id).length : 0;

  return (
    <Modal open={true} onClose={onClose} title={rule ? 'Edit Rule' : 'Create Rule'} size="lg">
      <div className="rule-builder">
        <div className="builder-section">
          <label>Rule name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Label invoices"
          />
        </div>

        <div className="builder-section">
          <div className="section-header">
            <label>Conditions</label>
            <button 
              className={`match-toggle ${matchAll ? 'all' : 'any'}`}
              onClick={() => setMatchAll(!matchAll)}
            >
              {matchAll ? 'Match ALL' : 'Match ANY'}
            </button>
          </div>
          
          {conditions.length === 0 ? (
            <div className="empty-conditions">No conditions added</div>
          ) : (
            conditions.map((condition, index) => (
              <div key={index} className="condition-row">
                {index > 0 && (
                  <span className="condition-logic">{matchAll ? 'AND' : 'OR'}</span>
                )}
                <select
                  value={condition.not ? 'not_' + condition.field : condition.field}
                  onChange={(e) => {
                    const isNot = e.target.value.startsWith('not_');
                    const field = isNot ? e.target.value.slice(4) : e.target.value;
                    updateCondition(index, 'field', field);
                    updateCondition(index, 'not', isNot);
                  }}
                >
                  {CONDITION_FIELDS.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                >
                  {CONDITION_FIELDS.find(f => f.id === condition.field)?.operators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                
                {condition.field === 'hasAttachment' ? (
                  <select
                    value={condition.value || 'true'}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : condition.field === 'read' || condition.field === 'starred' ? (
                  <select
                    value={condition.value || 'true'}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : condition.field === 'size' ? (
                  <div className="size-input">
                    <input
                      type="number"
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      placeholder="Size"
                    />
                    <select
                      value="MB"
                      disabled
                    >
                      <option value="MB">MB</option>
                    </select>
                  </div>
                ) : condition.field === 'priority' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                ) : condition.field === 'category' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : condition.field === 'label' ? (
                  <select
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  >
                    {labels.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    placeholder="Value"
                  />
                )}
                
                <button className="remove-btn" onClick={() => removeCondition(index)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
          
          <button className="add-btn" onClick={addCondition}>
            <Plus size={14} /> Add condition
          </button>
        </div>

        <div className="builder-section">
          <label>Actions</label>
          
          {actions.length === 0 ? (
            <div className="empty-actions">No actions added</div>
          ) : (
            actions.map((action, index) => (
              <div key={index} className="action-row">
                <select
                  value={action.type}
                  onChange={(e) => updateAction(index, 'type', e.target.value)}
                >
                  {ACTION_TYPES.map(a => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
                
                {action.type === 'label' ? (
                  <select
                    value={action.value}
                    onChange={(e) => updateAction(index, 'value', e.target.value)}
                  >
                    {labels.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                ) : action.type === 'move' ? (
                  <select
                    value={action.value}
                    onChange={(e) => updateAction(index, 'value', e.target.value)}
                  >
                    {FOLDER_OPTIONS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                ) : action.type === 'category' ? (
                  <select
                    value={action.value}
                    onChange={(e) => updateAction(index, 'value', e.target.value)}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : action.type === 'snooze' ? (
                  <select
                    value={action.value}
                    onChange={(e) => updateAction(index, 'value', e.target.value)}
                  >
                    <option value="later_today">Later today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="next_week">Next week</option>
                  </select>
                ) : (
                  <span className="action-no-value">(no value needed)</span>
                )}
                
                <button className="remove-btn" onClick={() => removeAction(index)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
          
          <button className="add-btn" onClick={addAction}>
            <Plus size={14} /> Add action
          </button>
        </div>

        {rule && matchingCount > 0 && (
          <div className="rule-preview-banner">
            <Eye size={16} />
            This rule would affect <strong>{matchingCount}</strong> email{matchingCount !== 1 ? 's' : ''}
          </div>
        )}

        <div className="builder-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>
            {rule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </div>
    </Modal>
  );
}