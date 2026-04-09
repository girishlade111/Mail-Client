import { useState, useMemo } from 'react';
import { Plus, CheckCircle, Circle, Flag, Trash2, Mail, Clock, AlertCircle } from 'lucide-react';
import { format, isToday, isPast, isFuture, parseISO } from 'date-fns';
import { useMail } from '../../context/MailContext';
import './TasksList.css';

export function TasksList() {
  const { tasks, addTask, deleteTask, toggleTaskComplete, updateTask, createTaskFromEmail } = useMail();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState('active');
  const [showPriority, setShowPriority] = useState(null);

  const groupedTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const overdue = [];
    const todayTasks = [];
    const upcoming = [];
    const completed = [];

    tasks.forEach(task => {
      if (task.completed) {
        completed.push(task);
      } else if (task.dueDate < today) {
        overdue.push(task);
      } else if (task.dueDate === today) {
        todayTasks.push(task);
      } else {
        upcoming.push(task);
      }
    });

    return { overdue, today: todayTasks, upcoming, completed };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return [...groupedTasks.overdue, ...groupedTasks.today, ...groupedTasks.upcoming];
    if (filter === 'completed') return groupedTasks.completed;
    return tasks;
  }, [filter, groupedTasks, tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    addTask({
      title: newTaskTitle,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      priority: showPriority || 'medium',
      linkedEmailId: null,
      linkedContactId: null,
    });
    setNewTaskTitle('');
    setShowPriority(null);
  };

  const handleToggleComplete = (taskId) => {
    toggleTaskComplete(taskId);
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-tertiary)';
    }
  };

  const renderTaskSection = (title, taskList, isOverdue = false) => {
    if (taskList.length === 0) return null;
    
    return (
      <div className="tasks-section">
        <div className={`tasks-section-header ${isOverdue ? 'overdue' : ''}`}>
          {isOverdue && <AlertCircle size={12} />}
          <span>{title}</span>
          <span className="count">{taskList.length}</span>
        </div>
        {taskList.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <button 
              className="task-checkbox"
              onClick={() => handleToggleComplete(task.id)}
            >
              {task.completed ? (
                <CheckCircle size={18} className="checked" />
              ) : (
                <Circle size={18} />
              )}
            </button>
            <div className="task-content">
              <span className="task-title">{task.title}</span>
              {task.linkedEmailId && (
                <span className="task-link">
                  <Mail size={10} />
                  Linked to email
                </span>
              )}
              <div className="task-meta">
                <span 
                  className="task-priority"
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  <Flag size={10} />
                </span>
                <span className="task-due">
                  <Clock size={10} />
                  {format(parseISO(task.dueDate), 'MMM d')}
                </span>
              </div>
            </div>
            <button 
              className="task-delete"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="tasks-list">
      <div className="tasks-header">
        <h4>Tasks</h4>
        <div className="tasks-filter">
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Done
          </button>
        </div>
      </div>

      <form className="add-task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Add a task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="add-task-input"
        />
        <button type="submit" className="add-task-btn" disabled={!newTaskTitle.trim()}>
          <Plus size={16} />
        </button>
      </form>

      <div className="tasks-items">
        {filter === 'active' && (
          <>
            {renderTaskSection('Overdue', groupedTasks.overdue, true)}
            {renderTaskSection('Today', groupedTasks.today)}
            {renderTaskSection('Upcoming', groupedTasks.upcoming)}
          </>
        )}
        
        {filter === 'completed' && groupedTasks.completed.map(task => (
          <div key={task.id} className="task-item completed">
            <button 
              className="task-checkbox"
              onClick={() => handleToggleComplete(task.id)}
            >
              <CheckCircle size={18} className="checked" />
            </button>
            <div className="task-content">
              <span className="task-title">{task.title}</span>
              <div className="task-meta">
                <span className="task-due completed-date">
                  Completed {format(parseISO(task.dueDate), 'MMM d')}
                </span>
              </div>
            </div>
            <button 
              className="task-delete"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="empty-tasks">
            <p>No {filter} tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}