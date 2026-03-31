import { useState } from 'react';
import { FileText, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import './NotesPad.css';

export function NotesPad() {
  const [note, setNote] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  const handleSave = () => {
    if (note.trim()) {
      setLastSaved(new Date());
    }
  };

  return (
    <div className="notes-pad">
      <div className="notes-header">
        <h4>Quick Notes</h4>
        {lastSaved && (
          <span className="last-saved">
            <Clock size={12} />
            Saved {format(lastSaved, 'h:mm a')}
          </span>
        )}
      </div>
      <textarea
        className="notes-textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleSave}
        placeholder="Write a quick note..."
      />
      <div className="notes-footer">
        <span className="char-count">{note.length} characters</span>
        {note && (
          <button className="clear-note" onClick={() => setNote('')}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}