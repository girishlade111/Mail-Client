import { useState, useEffect, useCallback, useMemo } from 'react';
import { MailProvider, useMail } from './context/MailContext';
import { UIProvider, useUI } from './context/UIContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { MailRow, MailRowSkeleton } from './components/MailRow';
import { MailDetail } from './components/MailDetail';
import { ThreadView } from './components/mail/ThreadView';
import { ComposeModal } from './components/compose/ComposeModal';
import { FilterChips, EmptyInbox, LoadingState } from './components/mail/FilterChips';
import { BulkActions } from './components/mail/BulkActions';
import { InboxHeader } from './components/mail/InboxHeader';
import { CommandPalette } from './components/ui/CommandPalette';
import { KeyboardShortcuts } from './components/ui/KeyboardShortcuts';
import { ToastContainer } from './components/ui/Toast';
import { SettingsLayout, SettingsGeneral, SettingsAppearance, SettingsInbox, SettingsAccounts, SettingsSignatures, SettingsFilters, SettingsNotifications, SettingsShortcuts, SettingsOrganization, SettingsLabels, SettingsPrivacy } from './components/settings/SettingsLayout';
import { Search, Star, Users, Circle, Mail } from 'lucide-react';
import { ContactDrawer } from './components/contacts/ContactDrawer';
import './App.css';

function ContactsView({ onBack }) {
  const { contacts, contactGroups, toggleContactFavorite, setSelectedContact, getRecentContacts, selectedContact } = useMail();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { openCompose } = useUI();

  const filteredContacts = useMemo(() => {
    let result = contacts.filter(c => 
      filter === 'all' || 
      (filter === 'favorites' && c.isFavorite) ||
      c.tags.includes(filter)
    );
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.organization?.toLowerCase().includes(q)
      );
    }
    
    return result;
  }, [contacts, filter, searchTerm]);

  const groupedContacts = useMemo(() => {
    const favorites = filteredContacts.filter(c => c.isFavorite).slice(0, 5);
    const groups = {};
    
    filteredContacts.filter(c => !c.isFavorite).forEach(contact => {
      const letter = contact.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(contact);
    });
    
    return { favorites, groups };
  }, [filteredContacts]);

  const recentContacts = getRecentContacts(3);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleCompose = (contact) => {
    openCompose({ to: [{ name: contact.name, email: contact.email }] });
  };

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
          <Users size={16} /> All ({contacts.length})
        </button>
        <button className={`filter-tab ${filter === 'favorites' ? 'active' : ''}`} onClick={() => setFilter('favorites')}>
          <Star size={16} /> Favorites
        </button>
        {contactGroups.map(group => (
          <button key={group.id} className={`filter-tab ${filter === group.id ? 'active' : ''}`} onClick={() => setFilter(group.memberIds[0])}>
            <Circle size={16} /> {group.name}
          </button>
        ))}
      </div>

      <div className="contacts-list">
        {recentContacts.length > 0 && filter === 'all' && !searchTerm && (
          <div className="contacts-section">
            <h3 className="section-title">Recently Contacted</h3>
            <div className="contacts-grid">
              {recentContacts.map(contact => (
                <div key={contact.id} className="contact-card clickable" onClick={() => handleContactClick(contact)}>
                  <div className="contact-avatar">{contact.name.charAt(0)}</div>
                  <div className="contact-info">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-email">{contact.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {groupedContacts.favorites.length > 0 && (filter === 'all' || filter === 'favorites') && !searchTerm && (
          <div className="contacts-section">
            <h3 className="section-title">Favorites</h3>
            <div className="contacts-grid">
              {groupedContacts.favorites.map(contact => (
                <div key={contact.id} className="contact-card clickable" onClick={() => handleContactClick(contact)}>
                  <div className="contact-avatar">{contact.name.charAt(0)}</div>
                  <div className="contact-info">
                    <div className="contact-name">
                      {contact.name}
                      <Star size={14} className="favorite-star" fill="#eab308" />
                    </div>
                    <div className="contact-email">{contact.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {Object.keys(groupedContacts.groups).sort().map(letter => (
          <div key={letter} className="contacts-section">
            <h3 className="section-title">{letter}</h3>
            <div className="contacts-grid">
              {groupedContacts.groups[letter].map(contact => (
                <div key={contact.id} className="contact-card clickable" onClick={() => handleContactClick(contact)}>
                  <div className="contact-avatar">{contact.name.charAt(0)}</div>
                  <div className="contact-info">
                    <div className="contact-name">
                      {contact.name}
                      {contact.isFavorite && <Star size={14} className="favorite-star" fill="#eab308" />}
                    </div>
                    <div className="contact-email">{contact.email}</div>
                    <div className="contact-org">{contact.organization} • {contact.role}</div>
                  </div>
                  <button 
                    className="contact-compose-btn" 
                    onClick={(e) => { e.stopPropagation(); handleCompose(contact); }}
                    title="Compose"
                  >
                    <Mail size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {filteredContacts.length === 0 && (
          <div className="contacts-empty">
            <Users size={48} />
            <h4>No contacts found</h4>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchView({ onBack }) {
  const { searchQuery, isSearchActive, searchResults, searchState, clearSearch, setShowAdvancedSearch } = useMail();
  const { setSelectedEmail, setSidebarOpen } = useUI();
  const [searchType, setSearchType] = useState('all');

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const hasActiveFilters = isSearchActive && Object.keys(searchState).some(key => {
    if (key === 'query') return false;
    const value = searchState[key];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    return value !== '' && value !== null;
  });

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <div className="search-view">
      {!isSearchActive || !searchQuery ? (
        <div className="search-empty_state">
          <Search size={48} className="empty-icon" />
          <h3>Search your emails</h3>
          <p>Enter a search term or use advanced filters</p>
          <button 
            className="advanced-search-btn"
            onClick={() => setShowAdvancedSearch(true)}
          >
            Advanced search
          </button>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="search-no_results">
          <Search size={48} className="empty-icon" />
          <h3>No results found</h3>
          <p>Try adjusting your search terms or filters</p>
          <button 
            className="advanced-search-btn"
            onClick={() => setShowAdvancedSearch(true)}
          >
            Advanced search
          </button>
        </div>
      ) : (
        <>
          <div className="search-header">
            <div className="search-header-top">
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
              <button 
                className="filter-chip clear-btn"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="search-results">
            {searchResults.map(email => (
              <MailRow
                key={email.id}
                email={email}
                isSelected={false}
                onClick={() => handleEmailSelect(email)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MailApp() {
  const { 
    emails, 
    selectedEmail, 
    setSelectedEmail, 
    markAsRead, 
    getActiveThread, 
    currentFolder, 
    setCurrentFolder, 
    deleteEmail, 
    archiveEmail, 
    markAsUnread,
    moveToFolder,
    activeCategory,
    isLoading,
    markAllAsRead,
    density,
    toggleStar,
    addLabel,
    markAsImportant
  } = useMail();
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    rightPanelOpen, 
    setRightPanelOpen, 
    composeOpen, 
    setComposeOpen, 
    selectedEmails, 
    setSelectedEmails,
    deselectAll, 
    toasts, 
    removeToast, 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    shortcutsOpen, 
    setShortcutsOpen, 
    currentView, 
    setCurrentView, 
    settingsTab, 
    setSettingsTab, 
    goToMain,
    addToast
  } = useUI();
  const { toggleTheme } = useTheme();
  const [showThread, setShowThread] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleCheckChange = useCallback((emailId, checked) => {
    setSelectedEmails(prev => 
      checked 
        ? [...prev, emailId] 
        : prev.filter(id => id !== emailId)
    );
  }, [setSelectedEmails]);

  const handleSelectAll = useCallback(() => {
    if (selectedEmails.length === emails.length) {
      deselectAll();
    } else {
      setSelectedEmails(emails.map(e => e.id));
    }
  }, [emails, selectedEmails.length, deselectAll, setSelectedEmails]);

  const handleClearSelection = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  const handleBulkMove = useCallback((folder, folderName) => {
    const previousFolders = {};
    selectedEmails.forEach(id => {
      const email = emails.find(e => e.id === id);
      if (email) previousFolders[id] = email.folder;
    });
    selectedEmails.forEach(id => moveToFolder(id, folder));
    addToast(`Moved ${selectedEmails.length} messages to ${folderName || folder}`, 'success', {
      undoAction: () => {
        Object.entries(previousFolders).forEach(([id, prevFolder]) => {
          moveToFolder(id, prevFolder);
        });
        addToast('Moved back', 'info');
      }
    });
    deselectAll();
  }, [selectedEmails, moveToFolder, addToast, deselectAll, emails]);

  const handleBulkAddLabel = useCallback((_labelId) => {
    addToast(`Label added to ${selectedEmails.length} messages`);
    deselectAll();
  }, [selectedEmails.length, addToast, deselectAll]);

  const handleEmailSelect = useCallback((email) => {
    setSelectedEmail(email);
    if (!email.read) {
      markAsRead(email.id);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [setSelectedEmail, markAsRead, setSidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if (e.key === '?' && !e.target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setShortcutsOpen(false);
        if (selectedEmails.length > 0) {
          deselectAll();
        }
        return;
      }
      
      if (currentView === 'main' && emails.length > 0 && !e.target.matches('input, textarea, [contenteditable]')) {
        const email = emails[focusedIndex];
        
        if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          document.querySelector('.search-input')?.focus();
          return;
        }
        
        if (e.key === 'ArrowDown' || e.key === 'j') {
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, emails.length - 1));
          return;
        }
        if (e.key === 'ArrowUp' || e.key === 'k') {
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const em = emails[focusedIndex];
          if (em) handleEmailSelect(em);
          return;
        }
        
        if (e.key === 'x') {
          e.preventDefault();
          if (email) {
            const isSelected = selectedEmails.includes(email.id);
            handleCheckChange(email.id, !isSelected);
          }
          return;
        }
        
        if (e.key === ' ' && !e.shiftKey) {
          e.preventDefault();
          if (email) {
            const isSelected = selectedEmails.includes(email.id);
            handleCheckChange(email.id, !isSelected);
          }
          return;
        }
        
        if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setComposeOpen(true);
          return;
        }
        
        if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          setComposeOpen(true);
          return;
        }
        
        if ((e.key === 'e' || e.key === 'e') && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          if (selectedEmails.length > 0) {
            selectedEmails.forEach(id => archiveEmail(id));
            addToast(`Archived ${selectedEmails.length} messages`);
            deselectAll();
          } else if (email) {
            archiveEmail(email.id);
            addToast('Archived message');
          }
          return;
        }
        
        if (e.key === '#' || e.key === 'Delete') {
          e.preventDefault();
          if (selectedEmails.length > 0) {
            selectedEmails.forEach(id => deleteEmail(id));
            addToast(`Moved ${selectedEmails.length} messages to trash`);
            deselectAll();
          } else if (email) {
            deleteEmail(email.id);
            addToast('Moved to trash');
          }
          return;
        }
        
        if (!e.metaKey && !e.ctrlKey && e.key === 's') {
          e.preventDefault();
          if (email) {
            toggleStar(email.id);
          } else if (selectedEmails.length > 0) {
            selectedEmails.forEach(id => toggleStar(id));
            addToast(`Starred ${selectedEmails.length} messages`);
          }
          return;
        }
        
        if (!e.metaKey && !e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          if (selectedEmails.length > 0) {
            selectedEmails.forEach(id => markAsUnread(id));
            addToast(`Marked ${selectedEmails.length} as unread`);
            deselectAll();
          } else if (email) {
            markAsUnread(email.id);
            addToast('Marked as unread');
          }
          return;
        }
        
        if (!e.metaKey && !e.ctrlKey && e.key === '!') {
          e.preventDefault();
          if (selectedEmails.length > 0) {
            selectedEmails.forEach(id => markAsImportant(id));
            addToast(`Marked ${selectedEmails.length} as important`);
            deselectAll();
          } else if (email) {
            markAsImportant(email.id);
            addToast('Marked as important');
          }
          return;
        }
        
        if (e.key === '*' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handleSelectAll();
          return;
        }
        
        if (!e.metaKey && !e.ctrlKey && e.key === 'a') {
          e.preventDefault();
          handleSelectAll();
          return;
        }
        
        if (!e.metaKey && !e.ctrlKey && e.key === 'n') {
          e.preventDefault();
          const nextEmail = emails[focusedIndex + 1];
          if (nextEmail) {
            setFocusedIndex(focusedIndex + 1);
            handleEmailSelect(nextEmail);
          }
          return;
        }
        
        if (!e.metaKey && !e.ctrlKey && e.key === 'p') {
          e.preventDefault();
          const prevEmail = emails[focusedIndex - 1];
          if (prevEmail) {
            setFocusedIndex(focusedIndex - 1);
            handleEmailSelect(prevEmail);
          }
          return;
        }
      }
      
      if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        
        const pendingG = window.__pendingGKey = window.__pendingGKey || {};
        
        const handleGTimeout = () => {
          delete window.__pendingGKey;
        };
        
        if (!window.__pendingGKey) {
          window.__pendingGKey = { timeout: setTimeout(handleGTimeout, 1000) };
          return;
        }
        
        clearTimeout(window.__pendingGKey.timeout);
        const secondKey = e.key.toLowerCase();
        
        switch (secondKey) {
          case 'i':
            setCurrentFolder('inbox');
            break;
          case 's':
            setCurrentFolder('starred');
            break;
          case 'd':
            setCurrentFolder('drafts');
            break;
          case 't':
            setCurrentFolder('sent');
            break;
          case 'a':
            setCurrentFolder('archive');
            break;
          case 'c':
            setCurrentView('contacts');
            break;
        }
        
        delete window.__pendingGKey;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen, setShortcutsOpen, selectedEmails, deselectAll, currentView, emails, focusedIndex, handleCheckChange, handleEmailSelect, setComposeOpen, archiveEmail, deleteEmail, toggleStar, markAsUnread, markAsImportant, handleSelectAll, setCurrentFolder, setCurrentView, addToast]);

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
    snoozed: 'Snoozed',
    scheduled: 'Scheduled',
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
            {settingsTab === 'labels' && <SettingsLabels />}
            {settingsTab === 'organization' && <SettingsOrganization />}
            {settingsTab === 'notifications' && <SettingsNotifications />}
            {settingsTab === 'shortcuts' && <SettingsShortcuts />}
            {settingsTab === 'privacy' && <SettingsPrivacy />}
          </SettingsLayout>
        );
      case 'contacts':
        return (
          <>
            <ContactsView onBack={goToMain} />
            {selectedContact && (
              <ContactDrawer 
                contact={selectedContact} 
                onClose={() => setSelectedContact(null)} 
              />
            )}
          </>
        );
      case 'search':
        return <SearchView onBack={goToMain} />;
      default:
        return (
          <>
            <div className={`mail-list density-${density}`}>
              <div className="mail-list-header">
                <h2>{folderTitles[currentFolder] || 'Inbox'}</h2>
                <span className="mail-count">{emails.length} messages</span>
              </div>
              
              {currentFolder === 'inbox' && (
                <FilterChips />
              )}

              <InboxHeader 
                totalCount={emails.length}
                selectedCount={selectedEmails.length}
                allSelected={selectedEmails.length === emails.length && emails.length > 0}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onMarkAllRead={markAllAsRead}
              />

              {selectedEmails.length > 0 && (
                <BulkActions 
                  selectedCount={selectedEmails.length}
                  onArchive={() => {
                    selectedEmails.forEach(id => archiveEmail(id));
                    addToast(`Archived ${selectedEmails.length} messages`);
                    deselectAll();
                  }}
                  onDelete={() => {
                    selectedEmails.forEach(id => deleteEmail(id));
                    addToast(`Moved ${selectedEmails.length} messages to trash`);
                    deselectAll();
                  }}
                  onMarkRead={() => {
                    selectedEmails.forEach(id => markAsRead(id));
                    addToast(`Marked ${selectedEmails.length} as read`);
                    deselectAll();
                  }}
                  onMarkUnread={() => {
                    selectedEmails.forEach(id => markAsUnread(id));
                    addToast(`Marked ${selectedEmails.length} as unread`);
                    deselectAll();
                  }}
                  onMoveTo={handleBulkMove}
                  onAddLabel={handleBulkAddLabel}
                />
              )}
              
              <div className="mail-list-content">
                {isLoading ? (
                  <>
                    <MailRowSkeleton />
                    <MailRowSkeleton />
                    <MailRowSkeleton />
                    <MailRowSkeleton />
                  </>
                ) : emails.length === 0 ? (
                  currentFolder === 'inbox' && activeCategory ? (
                    <EmptyInbox category={activeCategory} />
                  ) : (
                    <div className="empty-inbox">
                      <div className="empty-icon">📭</div>
                      <h3>No messages</h3>
                      <p>Your {folderTitles[currentFolder] || 'inbox'} is empty</p>
                    </div>
                  )
                ) : (
                  emails.map((email, index) => (
                    <MailRow
                      key={email.id}
                      email={email}
                      isSelected={selectedEmail?.id === email.id}
                      isChecked={selectedEmails.includes(email.id)}
                      onCheckChange={handleCheckChange}
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
        onNavigate={(view) => {
          if (view === 'inbox' || view === 'sent' || view === 'starred' || view === 'archive' || view === 'trash') {
            setCurrentFolder(view);
          } else if (view === 'compose') {
            setComposeOpen(true);
          } else if (view === 'contacts') {
            setCurrentView('contacts');
          } else if (view === 'settings') {
            setCurrentView('settings');
          }
        }}
        onCompose={() => setComposeOpen(true)}
        onToggleTheme={toggleTheme}
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