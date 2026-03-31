import { formatDistanceToNow, isToday, isYesterday, format, isThisWeek } from 'date-fns';

export function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isToday(d)) {
    return formatDistanceToNow(d, { addSuffix: true });
  }
  
  if (isYesterday(d)) {
    return 'Yesterday';
  }
  
  if (isThisWeek(d, { weekStartsOn: 1 })) {
    return format(d, 'EEEE');
  }
  
  return format(d, 'MMM d, yyyy');
}

export function formatFullDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'MMMM d, yyyy at h:mm a');
}

export function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'h:mm a');
}
