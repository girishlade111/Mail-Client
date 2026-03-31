import { useState } from 'react';
import { Plus, CheckCircle, Circle, Flag, Trash2, Mail } from 'lucide-react';
import { tasks as initialTasks } from '../../data/mock';
import './TasksList.css';

export function TasksList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('active');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: `task-${Date.now()}`,
      title: newTask,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      linkedEmailId: null
    };
    
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-tertiary)';
    }
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

      <form className="add-task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="add-task-input"
        />
        <button type="submit" className="add-task-btn" disabled={!newTask.trim()}>
          <Plus size={18} />
        </button>
      </form>

      <div className="tasks-items">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <button 
              className="task-checkbox"
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? (
                <CheckCircle size={20} className="checked" />
              ) : (
                <Circle size={20} />
              )}
            </button>
            <div className="task-content">
              <span className="task-title">{task.title}</span>
              {task.linkedEmailId && (
                <span className="task-email">
                  <Mail size={12} />
                  From email
                </span>
              )}
              <div className="task-meta">
                <span 
                  className="task-priority"
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  <Flag size={12} fill={getPriorityColor(task.priority)} />
                </span>
                <span className="task-due">{task.dueDate}</span>
              </div>
            </div>
            <button 
              className="task-delete"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 size={16} />
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