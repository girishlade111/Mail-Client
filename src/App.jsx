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
import { SettingsLayout, SettingsGeneral, SettingsAppearance, SettingsInbox, SettingsAccounts, SettingsSignatures, SettingsFilters, SettingsNotifications, SettingsShortcuts } from './components/settings/SettingsLayout';
import { Search, Star, Archive, Trash2, Mail, Users, Circle, CheckCircle } from 'lucide-react';
import './App.css';

function ContactsView({ onBack }) {
  const { contacts } = useMail();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredContacts = contacts.filter(c => 
    filter === 'all' || 
    (filter === 'favorites' && c.isFavorite) ||
    c.tags.includes(filter)
  );

  return (
    <div className="contacts-view">
      <div className="contacts-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Contacts</h2>
        <div className="contacts-search">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search contacts..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="contacts-filters">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          <Users size={16} /> All
        </button>
        <button className={`filter-tab ${filter === 'favorites' ? 'active' : ''}`} onClick={() => setFilter('favorites')}>
          <Star size={16} /> Favorites
        </button>
        <button className={`filter-tab ${filter === 'client' ? 'active' : ''}`} onClick={() => setFilter('client')}>
          <Circle size={16} /> Clients
        </button>
        <button className={`filter-tab ${filter === 'team' ? 'active' : ''}`} onClick={() => setFilter('team')}>
          <Users size={16} /> Team
        </button>
      </div>

      <div className="contacts-list">
        {filteredContacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <div className="contact-avatar">
              {contact.name.charAt(0)}
            </div>
            <div className="contact-info">
              <div className="contact-name">
                {contact.name}
                {contact.isFavorite && <Star size={14} className="favorite-star" />}
              </div>
              <div className="contact-email">{contact.email}</div>
              <div className="contact-org">{contact.organization}</div>
            </div>
            <div className="contact-tags">
              {contact.tags.map(tag => (
                <span key={tag} className="contact-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchView({ onBack }) {
  const { emails, searchQuery } = useMail();
  const { searchActive, setSearchActive } = useUI();
  const [searchType, setSearchType] = useState('all');
  const [dateRange, setDateRange] = useState('any');

  const searchResults = emails.filter(email => 
    searchQuery && (
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="search-view">
      <div className="search-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Search Results</h2>
        <span className="search-count">{searchResults.length} results for "{searchQuery}"</span>
      </div>

      <div className="search-filters">
        <button className={`filter-chip ${searchType === 'all' ? 'active' : ''}`} onClick={() => setSearchType('all')}>
          All
        </button>
        <button className={`filter-chip ${searchType === 'from' ? 'active' : ''}`} onClick={() => setSearchType('from')}>
          From
        </button>
        <button className={`filter-chip ${searchType === 'to' ? 'active' : ''}`} onClick={() => setSearchType('to')}>
          To
        </button>
        <button className={`filter-chip ${searchType === 'subject' ? 'active' : ''}`} onClick={() => setSearchType('subject')}>
          Subject
        </button>
        <button className={`filter-chip ${searchType === 'hasAttachment' ? 'active' : ''}`} onClick={() => setSearchType('hasAttachment')}>
          Has attachment
        </button>
      </div>

      <div className="search-results">
        {searchResults.length === 0 ? (
          <div className="no-results">
            <Search size={48} />
            <p>No emails found</p>
            <span>Try adjusting your search terms</span>
          </div>
        ) : (
          searchResults.map(email => (
            <MailRow
              key={email.id}
              email={email}
              isSelected={false}
              onClick={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MailApp() {
  const { emails, selectedEmail, setSelectedEmail, markAsRead, getActiveThread, currentFolder, setCurrentFolder, toggleStar, deleteEmail, archiveEmail, markAsUnread } = useMail();
  const { sidebarOpen, setSidebarOpen, rightPanelOpen, setRightPanelOpen, composeOpen, setComposeOpen, selectedEmails, deselectAll, toasts, removeToast, commandPaletteOpen, setCommandPaletteOpen, shortcutsOpen, setShortcutsOpen, currentView, setCurrentView, settingsTab, setSettingsTab, goToMain } = useUI();
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

  const renderContent = () => {
    switch (currentView) {
      case 'settings':
        return (
          <SettingsLayout
            activeTab={settingsTab}
            onTabChange={setSettingsTab}
            onBack={goToMain}
          >
            {settingsTab === 'general' && <SettingsGeneral />}
            {settingsTab === 'appearance' && <SettingsAppearance />}
            {settingsTab === 'inbox' && <SettingsInbox />}
            {settingsTab === 'accounts' && <SettingsAccounts />}
            {settingsTab === 'signatures' && <SettingsSignatures />}
            {settingsTab === 'filters' && <SettingsFilters />}
            {settingsTab === 'notifications' && <SettingsNotifications />}
            {settingsTab === 'shortcuts' && <SettingsShortcuts />}
          </SettingsLayout>
        );
      case 'contacts':
        return <ContactsView onBack={goToMain} />;
      case 'search':
        return <SearchView onBack={goToMain} />;
      default:
        return (
          <>
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
          </>
        );
    }
  };

  return (
    <div className="app">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="app-body">
        {currentView !== 'settings' && currentView !== 'contacts' && currentView !== 'search' && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <main className="main-content">
          {renderContent()}
        </main>
        
        {currentView !== 'settings' && currentView !== 'contacts' && currentView !== 'search' && (
          <RightPanel 
            isOpen={rightPanelOpen} 
            onClose={() => setRightPanelOpen(false)} 
          />
        )}
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