import { useState, useMemo } from 'react';
import { FileText, Clock, X, Pin, Search, Trash2, Plus, Mail, User, Edit2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useMail } from '../../context/MailContext';
import './NotesPad.css';

export function NotesPad() {
  const { notes, addNote, updateNote, deleteNote, toggleNotePin, createNoteFromEmail, getPinnedNotes } = useMail();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredNotes = useMemo(() => {
    let result = [...notes];
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(n => n.content.toLowerCase().includes(q));
    }
    
    if (filter === 'pinned') {
      result = result.filter(n => n.pinned);
    }
    
    return result.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [notes, searchTerm, filter]);

  const pinnedNotes = getPinnedNotes();

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    addNote({ content: newNoteContent });
    setNewNoteContent('');
  };

  const handleUpdateNote = (noteId) => {
    if (!newNoteContent.trim()) return;
    updateNote(noteId, { content: newNoteContent });
    setEditingNote(null);
    setNewNoteContent('');
  };

  const handleDelete = (noteId) => {
    deleteNote(noteId);
  };

  const handleTogglePin = (noteId) => {
    toggleNotePin(noteId);
  };

  const startEditing = (note) => {
    setEditingNote(note.id);
    setNewNoteContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setNewNoteContent('');
  };

  return (
    <div className="notes-pad">
      <div className="notes-header">
        <h4>Quick Notes</h4>
        <div className="notes-filter">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'pinned' ? 'active' : ''}
            onClick={() => setFilter('pinned')}
          >
            <Pin size={12} />
            Pinned ({pinnedNotes.length})
          </button>
        </div>
      </div>

      <div className="notes-search">
        <Search size={14} />
        <input 
          type="text" 
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            <X size={12} />
          </button>
        )}
      </div>

      <div className="notes-list">
        {filteredNotes.map(note => (
          <div key={note.id} className={`note-item ${note.pinned ? 'pinned' : ''}`}>
            {editingNote === note.id ? (
              <div className="note-edit">
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your note..."
                  autoFocus
                />
                <div className="note-edit-actions">
                  <button className="save-btn" onClick={() => handleUpdateNote(note.id)}>Save</button>
                  <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="note-content">{note.content}</div>
                <div className="note-meta">
                  <span className="note-date">
                    <Clock size={10} />
                    {format(parseISO(note.updatedAt), 'MMM d, h:mm a')}
                  </span>
                  {note.linkedEmailId && (
                    <span className="note-linked">
                      <Mail size={10} />
                    </span>
                  )}
                  {note.linkedContactId && (
                    <span className="note-linked">
                      <User size={10} />
                    </span>
                  )}
                </div>
                <div className="note-actions">
                  <button 
                    className={`note-action-btn ${note.pinned ? 'active' : ''}`}
                    onClick={() => handleTogglePin(note.id)}
                    title={note.pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin size={14} />
                  </button>
                  <button 
                    className="note-action-btn"
                    onClick={() => startEditing(note)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    className="note-action-btn delete"
                    onClick={() => handleDelete(note.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="empty-notes">
            <FileText size={32} />
            <p>No notes yet</p>
            <span>Create a note below</span>
          </div>
        )}
      </div>

      <div className="notes-compose">
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Write a quick note..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.metaKey) {
              handleAddNote();
            }
          }}
        />
        <button 
          className="add-note-btn" 
          onClick={handleAddNote}
          disabled={!newNoteContent.trim()}
        >
          <Plus size={16} />
          Add Note
        </button>
      </div>
    </div>
  );
}