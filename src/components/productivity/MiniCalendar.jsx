import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, addDays, isSameMonth } from 'date-fns';
import { useMail } from '../../context/MailContext';
import './MiniCalendar.css';

export function MiniCalendar() {
  const { calendarEvents, getUpcomingReminders } = useMail();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);
  
  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return calendarEvents
      .filter(e => e.date >= today)
      .sort((a, b) => new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime))
      .slice(0, 4);
  }, [calendarEvents]);

  const getEventsForDay = (day) => {
    return calendarEvents.filter(event => 
      isSameDay(new Date(event.date), day)
    );
  };

  const getRemindersForDay = (day) => {
    const reminders = getUpcomingReminders();
    return reminders.filter(r => isSameDay(new Date(r.snoozeUntil), day));
  };
  
  const handleDayClick = (day) => {
    setSelectedDay(isSameDay(selectedDay, day) ? null : day);
  };

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];
  const selectedDayReminders = selectedDay ? getRemindersForDay(selectedDay) : [];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button className="calendar-nav-btn" onClick={goToPrevMonth}>
          <ChevronLeft size={16} />
        </button>
        <span className="calendar-month">
          {format(currentDate, 'MMM yyyy')}
        </span>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="calendar-weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="calendar-day empty" />
        ))}
        {days.map(day => {
          const events = getEventsForDay(day);
          const reminders = getRemindersForDay(day);
          const today = isToday(day);
          const isSelected = selectedDay && isSameDay(selectedDay, day);
          
          return (
            <button 
              key={day.toString()} 
              className={`calendar-day ${today ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {(events.length > 0 || reminders.length > 0) && (
                <div className="day-indicators">
                  {events.length > 0 && <div className="day-event-dot" />}
                  {reminders.length > 0 && <div className="day-reminder-dot" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="selected-day-events">
          <div className="selected-day-header">
            <span className="selected-date">{format(selectedDay, 'EEEE, MMM d')}</span>
            <button className="create-event-btn">
              <Plus size={14} />
            </button>
          </div>
          
          {selectedDayReminders.length > 0 && (
            <div className="events-section">
              <span className="events-section-label">Reminders</span>
              {selectedDayReminders.map(reminder => (
                <div key={reminder.id} className="event-item reminder">
                  <span className="event-title">{reminder.notes || 'Follow up'}</span>
                </div>
              ))}
            </div>
          )}
          
          {selectedDayEvents.length > 0 ? (
            <div className="events-section">
              <span className="events-section-label">Events</span>
              {selectedDayEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-color" style={{ backgroundColor: event.color }} />
                  <div className="event-info">
                    <span className="event-title">{event.title}</span>
                    <span className="event-time">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedDayReminders.length === 0 && (
            <div className="no-events">No events or reminders</div>
          )}
        </div>
      )}
      
      <div className="upcoming-events">
        <div className="upcoming-header">
          <h4>Upcoming</h4>
          <button className="today-btn" onClick={goToToday}>Today</button>
        </div>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <div key={event.id} className="event-item">
              <div className="event-color" style={{ backgroundColor: event.color }} />
              <div className="event-info">
                <span className="event-title">{event.title}</span>
                <span className="event-time">
                  <Clock size={10} />
                  {format(new Date(event.date + 'T' + event.startTime), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-events">
            <p>No upcoming events</p>
          </div>
        )}
      </div>
    </div>
  );
}