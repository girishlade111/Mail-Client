import { useState, useMemo } from 'react';
import { Clock, Bell, Trash2, Mail, Calendar, ChevronRight, Plus, X } from 'lucide-react';
import { format, addDays, isToday, isTomorrow, parseISO, isPast } from 'date-fns';
import { useMail } from '../../context/MailContext';
import './RemindersPanel.css';

export function RemindersPanel() {
  const { 
    reminders, 
    snoozeEmail, 
    unsnoozeEmail, 
    allEmails, 
    createTaskFromEmail,
    createNoteFromEmail
  } = useMail();
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(null);
  const [activeTab, setActiveTab] = useState('reminders');

  const groupedReminders = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const overdue = [];
    const todayRems = [];
    const tomorrow = [];
    const upcoming = [];

    reminders.forEach(r => {
      const snoozeDate = r.snoozeUntil;
      if (snoozeDate < today) {
        overdue.push(r);
      } else if (snoozeDate === today) {
        todayRems.push(r);
      } else if (snoozeDate === addDays(new Date(), 1).toISOString().split('T')[0]) {
        tomorrow.push(r);
      } else {
        upcoming.push(r);
      }
    });

    return { overdue, today: todayRems, tomorrow, upcoming };
  }, [reminders]);

  const snoozeOptions = [
    { label: 'Tomorrow', date: addDays(new Date(), 1).toISOString().split('T')[0] },
    { label: 'Next week', date: addDays(new Date(), 7).toISOString().split('T')[0] },
    { label: 'Next month', date: addDays(new Date(), 30).toISOString().split('T')[0] },
  ];

  const handleSnooze = (emailId, date) => {
    snoozeEmail(emailId, date);
    setShowSnoozeMenu(null);
  };

  const handleUnsnooze = (emailId) => {
    unsnoozeEmail(emailId);
  };

  const getEmailSubject = (emailId) => {
    const email = allEmails.find(e => e.id === emailId);
    return email?.subject || 'Unknown email';
  };

  const renderReminders = (title, reminderList, isOverdue = false) => {
    if (reminderList.length === 0) return null;

    return (
      <div className="reminders-section">
        <div className={`reminders-section-header ${isOverdue ? 'overdue' : ''}`}>
          {isOverdue && <Bell size={12} />}
          <span>{title}</span>
          <span className="count">{reminderList.length}</span>
        </div>
        {reminderList.map(reminder => {
          const emailSubject = getEmailSubject(reminder.emailId);
          return (
            <div key={reminder.id} className="reminder-item">
              <div className="reminder-icon">
                <Mail size={16} />
              </div>
              <div className="reminder-content">
                <span className="reminder-subject">{emailSubject}</span>
                <span className="reminder-date">
                  <Clock size={10} />
                  {format(parseISO(reminder.snoozeUntil), 'MMM d, yyyy')}
                </span>
                {reminder.notes && (
                  <span className="reminder-notes">{reminder.notes}</span>
                )}
              </div>
              <div className="reminder-actions">
                <button 
                  className="reminder-action-btn"
                  onClick={() => handleUnsnooze(reminder.emailId)}
                  title="Move back to inbox"
                >
                  <ChevronRight size={14} />
                </button>
                <button 
                  className="reminder-action-btn"
                  onClick={() => createTaskFromEmail(reminder.emailId, emailSubject)}
                  title="Create task"
                >
                  <Plus size={14} />
                </button>
                <button 
                  className="reminder-action-btn delete"
                  onClick={() => handleUnsnooze(reminder.emailId)}
                  title="Delete reminder"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="reminders-panel">
      <div className="reminders-header">
        <h4>Follow-ups</h4>
        <div className="reminders-filter">
          <button 
            className={activeTab === 'reminders' ? 'active' : ''}
            onClick={() => setActiveTab('reminders')}
          >
            <Bell size={14} />
            Reminders
          </button>
          <button 
            className={activeTab === 'snoozed' ? 'active' : ''}
            onClick={() => setActiveTab('snoozed')}
          >
            <Clock size={14} />
            Snoozed
          </button>
        </div>
      </div>

      {activeTab === 'reminders' && (
        <div className="reminders-content">
          {renderReminders('Overdue', groupedReminders.overdue, true)}
          {renderReminders('Today', groupedReminders.today)}
          {renderReminders('Tomorrow', groupedReminders.tomorrow)}
          {renderReminders('Upcoming', groupedReminders.upcoming)}

          {(groupedReminders.overdue.length === 0 && 
            groupedReminders.today.length === 0 && 
            groupedReminders.tomorrow.length === 0 &&
            groupedReminders.upcoming.length === 0) && (
            <div className="empty-reminders">
              <Bell size={32} />
              <p>No follow-ups</p>
              <span>Snooze emails to see them here</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'snoozed' && (
        <div className="snoozed-content">
          <div className="snooze-info">
            <h5>How to snooze emails</h5>
            <ul>
              <li>Select an email in your inbox</li>
              <li>Click the snooze button in the action bar</li>
              <li>Choose when to be reminded</li>
            </ul>
            <p className="snooze-tip">
              Snoozed emails will disappear from your inbox and reappear at the chosen time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}