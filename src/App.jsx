import { useState, useEffect } from 'react';
import { MailProvider, useMail } from './context/MailContext';
import { UIProvider, useUI } from './context/UIContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { MailRow } from './components/MailRow';
import { MailDetail } from './components/MailDetail';
import { ThreadView } from './components/mail/ThreadView';
import { ComposeModal } from './components/compose/ComposeModal';
import { FilterChips } from './components/mail/FilterChips';
import { BulkActions } from './components/mail/BulkActions';
import { CommandPalette } from './components/ui/CommandPalette';
import { KeyboardShortcuts } from './components/ui/KeyboardShortcuts';
import { ToastContainer } from './components/ui/Toast';
import './App.css';

function MailApp() {
  const { emails, selectedEmail, setSelectedEmail, markAsRead, getActiveThread, currentFolder, setCurrentFolder, toggleStar, deleteEmail, archiveEmail, markAsUnread } = useMail();
  const { sidebarOpen, setSidebarOpen, rightPanelOpen, setRightPanelOpen, composeOpen, setComposeOpen, selectedEmails, deselectAll, toasts, removeToast, commandPaletteOpen, setCommandPaletteOpen, shortcutsOpen, setShortcutsOpen } = useUI();
  const [showThread, setShowThread] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen, setShortcutsOpen]);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    if (!email.read) {
      markAsRead(email.id);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleBackToList = () => {
    setSelectedEmail(null);
    setShowThread(false);
  };

  const handleOpenThread = () => {
    setShowThread(true);
  };

  const folderTitles = {
    inbox: 'Inbox',
    sent: 'Sent',
    drafts: 'Drafts',
    starred: 'Starred',
    archive: 'Archive',
    spam: 'Spam',
    trash: 'Trash',
  };

  return (
    <div className="app">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="main-content">
          <div className="mail-list">
            <div className="mail-list-header">
              <h2>{folderTitles[currentFolder] || 'Inbox'}</h2>
              <span className="mail-count">{emails.length} emails</span>
            </div>
            
            {currentFolder === 'inbox' && (
              <FilterChips />
            )}

            {selectedEmails.length > 0 && (
              <BulkActions 
                selectedCount={selectedEmails.length}
                onArchive={() => {
                  selectedEmails.forEach(id => archiveEmail(id));
                  deselectAll();
                }}
                onDelete={() => {
                  selectedEmails.forEach(id => deleteEmail(id));
                  deselectAll();
                }}
                onMarkRead={() => {
                  selectedEmails.forEach(id => markAsRead(id));
                  deselectAll();
                }}
                onMarkUnread={() => {
                  selectedEmails.forEach(id => markAsUnread(id));
                  deselectAll();
                }}
              />
            )}
            
            <div className="mail-list-content">
              {emails.length === 0 ? (
                <div className="empty-state">
                  <p>No emails found</p>
                </div>
              ) : (
                emails.map((email) => (
                  <MailRow
                    key={email.id}
                    email={email}
                    isSelected={selectedEmail?.id === email.id}
                    onClick={() => handleEmailSelect(email)}
                  />
                ))
              )}
            </div>
          </div>
          
          <div className="mail-detail-container">
            {showThread && getActiveThread() ? (
              <ThreadView 
                thread={getActiveThread()} 
                onBack={handleBackToList}
              />
            ) : (
              <MailDetail 
                email={selectedEmail} 
                onBack={handleBackToList}
                onViewThread={handleOpenThread}
              />
            )}
          </div>
        </main>
        
        <RightPanel 
          isOpen={rightPanelOpen} 
          onClose={() => setRightPanelOpen(false)} 
        />
      </div>

      <ComposeModal 
        isOpen={composeOpen} 
        onClose={() => setComposeOpen(false)} 
      />

      <CommandPalette 
        open={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      <KeyboardShortcuts 
        open={shortcutsOpen} 
        onClose={() => setShortcutsOpen(false)} 
      />

      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <MailProvider>
          <MailApp />
        </MailProvider>
      </UIProvider>
    </ThemeProvider>
  );
}

export default App;