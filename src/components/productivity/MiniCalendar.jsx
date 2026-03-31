import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { calendarEvents } from '../../data/mock';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import './MiniCalendar.css';

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);
  
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const getEventsForDay = (day) => {
    return calendarEvents.filter(event => 
      isSameDay(new Date(event.date), day)
    );
  };

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <button className="calendar-nav-btn" onClick={goToPrevMonth}>
          <ChevronLeft size={18} />
        </button>
        <span className="calendar-month">
          {format(currentDate, 'MMMM yyyy')}
        </span>
        <button className="calendar-nav-btn" onClick={goToNextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>
      
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="calendar-day empty" />
        ))}
        {days.map(day => {
          const events = getEventsForDay(day);
          const today = isToday(day);
          
          return (
            <div 
              key={day.toString()} 
              className={`calendar-day ${today ? 'today' : ''}`}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {events.length > 0 && (
                <div className="day-events">
                  {events.slice(0, 2).map(event => (
                    <div 
                      key={event.id} 
                      className="day-event"
                      style={{ backgroundColor: event.color }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="upcoming-events">
        <h4>Upcoming</h4>
        {calendarEvents.slice(0, 3).map(event => (
          <div key={event.id} className="event-item">
            <div className="event-color" style={{ backgroundColor: event.color }} />
            <div className="event-info">
              <span className="event-title">{event.title}</span>
              <span className="event-time">
                <Clock size={12} />
                {format(new Date(event.date + 'T' + event.startTime), 'MMM d, h:mm a')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}