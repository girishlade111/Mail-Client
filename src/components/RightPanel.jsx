import { X, Calendar, ListTodo, Bell, FileText, PanelRightClose, Pin } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { MiniCalendar } from './productivity/MiniCalendar';
import { TasksList } from './productivity/TasksList';
import { RemindersPanel } from './productivity/RemindersPanel';
import { NotesPad } from './productivity/NotesPad';
import './RightPanel.css';

export function RightPanel({ isOpen, onClose }) {
  const { rightPanelTab, setRightPanelTab } = useUI();

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: ListTodo },
    { id: 'reminders', label: 'Follow-up', icon: Bell },
    { id: 'notes', label: 'Notes', icon: FileText },
  ];

  return (
    <>
      {isOpen && <div className="right-panel-overlay" onClick={onClose} />}
      <aside className={`right-panel ${isOpen ? 'right-panel-open' : ''}`}>
        <div className="right-panel-header">
          <div className="panel-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`panel-tab ${rightPanelTab === tab.id ? 'active' : ''}`}
                onClick={() => setRightPanelTab(tab.id)}
                title={tab.label}
              >
                <tab.icon size={18} />
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="right-panel-content">
          {rightPanelTab === 'calendar' && <MiniCalendar />}
          {rightPanelTab === 'tasks' && <TasksList />}
          {rightPanelTab === 'reminders' && <RemindersPanel />}
          {rightPanelTab === 'notes' && <NotesPad />}
        </div>
      </aside>
    </>
  );
}