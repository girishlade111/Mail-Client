import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, MoreVertical, Play, Pause, GripVertical, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import { RuleBuilder } from './RuleBuilder';
import { RulePreview } from './RulePreview';
import './RulesManager.css';

export function RulesManager() {
  const { rules, toggleRule, deleteRule, duplicateRule, reorderRules, getMatchingEmailsForRule } = useMail();
  const { addToast } = useUI();
  
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setShowBuilder(true);
  };

  const handleDuplicate = (ruleId) => {
    duplicateRule(ruleId);
    addToast('Rule duplicated');
    setMenuOpen(null);
  };

  const handleDelete = (ruleId) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRule(ruleId);
      addToast('Rule deleted');
    }
  };

  const handleToggle = (ruleId) => {
    toggleRule(ruleId);
    const rule = rules.find(r => r.id === ruleId);
    addToast(rule?.enabled ? 'Rule disabled' : 'Rule enabled');
  };

  const handlePreview = (ruleId) => {
    setShowPreview(ruleId);
    setMenuOpen(null);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      reorderRules(index, index - 1);
    }
  };

  const handleMoveDown = (index) => {
    if (index < rules.length - 1) {
      reorderRules(index, index + 1);
    }
  };

  const getConditionSummary = (rule) => {
    const { conditions, matchAll } = rule;
    if (conditions.length === 0) return 'No conditions';
    if (conditions.length === 1) {
      const c = conditions[0];
      return `${c.field} ${c.not ? 'not ' : ''}${c.operator} "${c.value}"`;
    }
    return `${conditions.length} conditions (${matchAll ? 'all' : 'any'})`;
  };

  const getActionSummary = (rule) => {
    const { actions } = rule;
    if (actions.length === 0) return 'No actions';
    return actions.map(a => {
      switch (a.type) {
        case 'label': return 'Apply label';
        case 'move': return 'Move to folder';
        case 'archive': return 'Archive';
        case 'delete': return 'Delete';
        case 'markRead': return 'Mark read';
        case 'markUnread': return 'Mark unread';
        case 'markImportant': return 'Mark important';
        case 'star': return 'Star';
        case 'snooze': return 'Snooze';
        case 'category': return 'Set category';
        case 'flag': return 'Flag';
        default: return a.type;
      }
    }).join(', ');
  };

  return (
    <div className="rules-manager">
      <div className="rules-header">
        <div className="rules-title">
          <h3>Filters & Rules</h3>
          <span className="rules-count">{rules.filter(r => r.enabled).length} of {rules.length} active</span>
        </div>
        <button className="create-rule-btn" onClick={() => { setEditingRule(null); setShowBuilder(true); }}>
          <Plus size={16} />
          Create rule
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="rules-empty">
          <AlertCircle size={48} />
          <h4>No rules yet</h4>
          <p>Create your first rule to automatically organize your emails</p>
          <button onClick={() => setShowBuilder(true)}>Create rule</button>
        </div>
      ) : (
        <div className="rules-list">
          {sortedRules.map((rule, index) => {
            const matchingCount = getMatchingEmailsForRule(rule.id).length;
            
            return (
              <div 
                key={rule.id} 
                className={`rule-item ${!rule.enabled ? 'disabled' : ''} ${expandedRule === rule.id ? 'expanded' : ''}`}
              >
                <div className="rule-main">
                  <div className="rule-drag">
                    <GripVertical size={14} />
                  </div>
                  
                  <button 
                    className="rule-toggle"
                    onClick={() => handleToggle(rule.id)}
                    title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                  >
                    {rule.enabled ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                  
                  <div className="rule-info" onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}>
                    <div className="rule-name">{rule.name}</div>
                    <div className="rule-summary">
                      <span className="rule-conditions">{getConditionSummary(rule)}</span>
                      <ChevronRight size={12} />
                      <span className="rule-actions">{getActionSummary(rule)}</span>
                    </div>
                  </div>
                  
                  <div className="rule-match-count">
                    {matchingCount} match{matchingCount !== 1 ? 'es' : ''}
                  </div>
                  
                  <div className="rule-menu" ref={menuRef}>
                    <button 
                      className="rule-menu-btn"
                      onClick={() => setMenuOpen(menuOpen === rule.id ? null : rule.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {menuOpen === rule.id && (
                      <div className="rule-dropdown">
                        <button onClick={() => { handleEdit(rule); setMenuOpen(null); }}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button onClick={() => handleDuplicate(rule.id)}>
                          <Copy size={14} /> Duplicate
                        </button>
                        <button onClick={() => handlePreview(rule.id)}>
                          <Play size={14} /> Preview
                        </button>
                        <button onClick={() => handleMoveUp(index)} disabled={index === 0}>
                          Move up
                        </button>
                        <button onClick={() => handleMoveDown(index)} disabled={index === rules.length - 1}>
                          Move down
                        </button>
                        <button className="danger" onClick={() => handleDelete(rule.id)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {expandedRule === rule.id && (
                  <div className="rule-expanded">
                    <div className="rule-conditions-detail">
                      <h5>Conditions ({rule.matchAll ? 'Match all' : 'Match any'})</h5>
                      {rule.conditions.map((c, i) => (
                        <div key={i} className="condition-item">
                          {c.not && <span className="not-badge">NOT</span>}
                          {c.field} {c.operator} "{c.value}"
                        </div>
                      ))}
                    </div>
                    <div className="rule-actions-detail">
                      <h5>Actions</h5>
                      {rule.actions.map((a, i) => (
                        <div key={i} className="action-item">
                          {a.type}: {a.value || '(none)'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showBuilder && (
        <RuleBuilder 
          rule={editingRule}
          onClose={() => { setShowBuilder(false); setEditingRule(null); }}
        />
      )}

      {showPreview && (
        <RulePreview 
          ruleId={showPreview}
          onClose={() => setShowPreview(null)}
        />
      )}
    </div>
  );
}