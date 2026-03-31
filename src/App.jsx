import { useState } from 'react';
import { MailProvider, useMail } from './context/MailContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { MailRow } from './components/MailRow';
import { MailDetail } from './components/MailDetail';
import './App.css';

function MailApp() {
  const { emails, selectedEmail, setSelectedEmail, markAsRead } = useMail();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    if (!email.read) {
      markAsRead(email.id);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="app-body">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="main-content">
          <div className="mail-list">
            <div className="mail-list-header">
              <h2>Inbox</h2>
              <span className="mail-count">{emails.length} emails</span>
            </div>
            
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
            <MailDetail email={selectedEmail} onBack={() => setSelectedEmail(null)} />
          </div>
        </main>
        
        <RightPanel 
          isOpen={rightPanelOpen} 
          onClose={() => setRightPanelOpen(false)} 
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <MailProvider>
      <MailApp />
    </MailProvider>
  );
}

export default App;