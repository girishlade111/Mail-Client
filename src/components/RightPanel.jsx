import { X, User, Calendar, FileText, MessageSquare } from 'lucide-react';
import './RightPanel.css';

export function RightPanel({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="right-panel-overlay" onClick={onClose} />}
      <aside className={`right-panel ${isOpen ? 'right-panel-open' : ''}`}>
        <div className="right-panel-header">
          <h3>Details</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="right-panel-content">
          <div className="panel-section">
            <div className="panel-icon">
              <User size={20} />
            </div>
            <div className="panel-info">
              <span className="panel-label">Contact</span>
              <span className="panel-value">Select an email</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-icon">
              <Calendar size={20} />
            </div>
            <div className="panel-info">
              <span className="panel-label">Calendar</span>
              <span className="panel-value">No events today</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-icon">
              <FileText size={20} />
            </div>
            <div className="panel-info">
              <span className="panel-label">Files</span>
              <span className="panel-value">No attachments</span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-icon">
              <MessageSquare size={20} />
            </div>
            <div className="panel-info">
              <span className="panel-label">Notes</span>
              <span className="panel-value">Quick notes</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}