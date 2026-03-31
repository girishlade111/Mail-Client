import { useState } from 'react';
import { MessageBlock } from './MessageBlock';
import './ThreadView.css';

export function ThreadView({ thread, onBack }) {
  const [expandedMessages, setExpandedMessages] = useState(
    thread.messages.reduce((acc, msg, idx) => {
      acc[msg.id] = idx === thread.messages.length - 1;
      return acc;
    }, {})
  );

  const toggleMessage = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const totalMessages = thread.messages.length;
  const expandedCount = Object.values(expandedMessages).filter(Boolean).length;

  if (!thread || !thread.messages || thread.messages.length === 0) {
    return (
      <div className="thread-view empty">
        <p>No messages in this thread</p>
      </div>
    );
  }

  return (
    <div className="thread-view">
      <div className="thread-header">
        <h2 className="thread-subject">{thread.subject}</h2>
        <div className="thread-info">
          <span className="thread-count">{totalMessages} messages</span>
        </div>
      </div>

      <div className="thread-messages">
        {thread.messages.map((message, index) => (
          <div key={message.id} className="thread-message-wrapper">
            {index > 0 && (
              <div className="thread-timeline">
                <div className="timeline-connector" />
              </div>
            )}
            <div 
              className={`thread-message ${!expandedMessages[message.id] ? 'collapsed-view' : ''}`}
              onClick={() => !expandedMessages[message.id] && toggleMessage(message.id)}
            >
              {!expandedMessages[message.id] ? (
                <div className="collapsed-preview">
                  <span className="preview-from">{message.from.name}</span>
                  <span className="preview-subject">{message.subject}</span>
                </div>
              ) : (
                <MessageBlock 
                  message={message} 
                  isExpanded={true}
                  onToggle={() => toggleMessage(message.id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {expandedCount < totalMessages && (
        <button 
          className="show-earlier-btn"
          onClick={() => {
            const allExpanded = {};
            thread.messages.forEach(msg => {
              allExpanded[msg.id] = true;
            });
            setExpandedMessages(allExpanded);
          }}
        >
          Show {totalMessages - expandedCount} earlier message{totalMessages - expandedCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}