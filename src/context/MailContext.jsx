import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { emails as initialEmails, labels, contacts, tasks, calendarEvents, currentUser, accounts } from '../data/mock';

const MailContext = createContext(null);

const initialSearchState = {
  query: '',
  from: '',
  to: '',
  subject: '',
  hasWords: '',
  excludeWords: '',
  hasAttachment: false,
  labels: [],
  folder: '',
  category: '',
  dateRange: '',
  dateBefore: null,
  dateAfter: null,
  sizeLarger: '',
  sizeSmaller: '',
  isRead: null,
  isStarred: null,
  importance: '',
  hasInvite: false,
  hasReminder: false,
  account: '',
};

export function MailProvider({ children }) {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('primary');
  const [sortOrder, setSortOrder] = useState('newest');
  const [conversationView, setConversationView] = useState(true);
  const [density, setDensity] = useState('comfortable');
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchState, setSearchState] = useState(initialSearchState);
  const [searchHistory, setSearchHistory] = useState([
    { id: '1', query: 'Q4 design', date: '2026-04-01' },
    { id: '2', query: 'invoice', date: '2026-03-30' },
    { id: '3', query: 'team standup', date: '2026-03-28' },
  ]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const threads = useMemo(() => {
    const threadMap = {};
    emails.forEach(email => {
      if (email.threadId) {
        if (!threadMap[email.threadId]) {
          threadMap[email.threadId] = [];
        }
        threadMap[email.threadId].push(email);
      }
    });
    
    Object.keys(threadMap).forEach(threadId => {
      threadMap[threadId].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    return threadMap;
  }, [emails]);

  const performSearch = useCallback((searchState, allEmails) => {
    let results = [...allEmails];
    
    if (searchState.query) {
      const q = searchState.query.toLowerCase();
      results = results.filter(email =>
        email.subject.toLowerCase().includes(q) ||
        email.from.name.toLowerCase().includes(q) ||
        email.from.email.toLowerCase().includes(q) ||
        email.body.toLowerCase().includes(q) ||
        email.to.some(t => t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q))
      );
    }
    
    if (searchState.from) {
      const from = searchState.from.toLowerCase();
      results = results.filter(email =>
        email.from.name.toLowerCase().includes(from) ||
        email.from.email.toLowerCase().includes(from)
      );
    }
    
    if (searchState.to) {
      const to = searchState.to.toLowerCase();
      results = results.filter(email =>
        email.to.some(t => t.name.toLowerCase().includes(to) || t.email.toLowerCase().includes(to))
      );
    }
    
    if (searchState.subject) {
      const subj = searchState.subject.toLowerCase();
      results = results.filter(email => email.subject.toLowerCase().includes(subj));
    }
    
    if (searchState.hasWords) {
      const words = searchState.hasWords.toLowerCase();
      results = results.filter(email => email.body.toLowerCase().includes(words));
    }
    
    if (searchState.excludeWords) {
      const words = searchState.excludeWords.toLowerCase();
      results = results.filter(email => !email.body.toLowerCase().includes(words));
    }
    
    if (searchState.hasAttachment) {
      results = results.filter(email => email.attachments && email.attachments.length > 0);
    }
    
    if (searchState.labels.length > 0) {
      results = results.filter(email =>
        searchState.labels.some(label => email.labels.includes(label))
      );
    }
    
    if (searchState.folder) {
      results = results.filter(email => email.folder === searchState.folder);
    }
    
    if (searchState.category) {
      results = results.filter(email => email.category === searchState.category);
    }
    
    if (searchState.isRead !== null) {
      results = results.filter(email => email.read === searchState.isRead);
    }
    
    if (searchState.isStarred !== null) {
      results = results.filter(email => email.starred === searchState.isStarred);
    }
    
    if (searchState.importance) {
      results = results.filter(email => email.priority === searchState.importance);
    }
    
    if (searchState.dateRange || searchState.dateBefore || searchState.dateAfter) {
      const now = new Date();
      results = results.filter(email => {
        const emailDate = new Date(email.date);
        
        if (searchState.dateRange) {
          switch (searchState.dateRange) {
            case 'today':
              return emailDate.toDateString() === now.toDateString();
            case 'yesterday':
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              return emailDate.toDateString() === yesterday.toDateString();
            case 'this_week':
              const weekAgo = new Date(now);
              weekAgo.setDate(weekAgo.getDate() - 7);
              return emailDate >= weekAgo;
            case 'this_month':
              const monthAgo = new Date(now);
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return emailDate >= monthAgo;
            case 'older':
              const monthAgoOld = new Date(now);
              monthAgoOld.setMonth(monthAgoOld.getMonth() - 1);
              return emailDate < monthAgoOld;
            default:
              return true;
          }
        }
        
        if (searchState.dateBefore) {
          const before = new Date(searchState.dateBefore);
          if (emailDate > before) return false;
        }
        
        if (searchState.dateAfter) {
          const after = new Date(searchState.dateAfter);
          if (emailDate < after) return false;
        }
        
        return true;
      });
    }
    
    if (searchState.sizeLarger) {
      const sizeMB = parseInt(searchState.sizeLarger);
      results = results.filter(email => {
        const totalSize = (email.attachments || []).reduce((acc, att) => acc + (att.size || 0), 0);
        return totalMB(sizeMB) > sizeMB;
      });
    }
    
    if (searchState.sizeSmaller) {
      const sizeMB = parseInt(searchState.sizeSmaller);
      results = results.filter(email => {
        const totalSize = (email.attachments || []).reduce((acc, att) => acc + (att.size || 0), 0);
        return totalSize < sizeMB;
      });
    }
    
    return results;
  }, []);

  const totalMB = (bytes) => bytes / (1024 * 1024);

  const searchResults = useMemo(() => {
    if (!isSearchActive) return [];
    return performSearch(searchState, emails);
  }, [isSearchActive, searchState, emails, performSearch]);

  const quickFilterResults = useCallback((filterType) => {
    switch (filterType) {
      case 'unread':
        return emails.filter(e => !e.read && e.folder !== 'trash' && e.folder !== 'spam');
      case 'starred':
        return emails.filter(e => e.starred && e.folder !== 'trash' && e.folder !== 'spam');
      case 'attachments':
        return emails.filter(e => e.attachments && e.attachments.length > 0);
      case 'important':
        return emails.filter(e => e.priority === 'high');
      case 'invoices':
        return emails.filter(e => 
          e.subject.toLowerCase().includes('invoice') ||
          e.subject.toLowerCase().includes('bill') ||
          e.subject.toLowerCase().includes('payment')
        );
      case 'meetings':
        return emails.filter(e => 
          e.subject.toLowerCase().includes('meeting') ||
          e.subject.toLowerCase().includes('invite') ||
          e.subject.toLowerCase().includes('calendar')
        );
      default:
        return [];
    }
  }, [emails]);

  const addToHistory = useCallback((query) => {
    if (!query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h.query !== query);
      return [{ id: Date.now().toString(), query, date: new Date().toISOString() }, ...filtered].slice(0, 10);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const saveSearch = useCallback((name, searchState) => {
    setSavedSearches(prev => [...prev, { id: Date.now().toString(), name, searchState, createdAt: new Date().toISOString() }]);
  }, []);

  const deleteSavedSearch = useCallback((id) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
  }, []);

  const applySearch = useCallback((newSearchState) => {
    setSearchState(newSearchState);
    setIsSearchActive(true);
    if (newSearchState.query) {
      addToHistory(newSearchState.query);
    }
  }, [addToHistory]);

  const clearSearch = useCallback(() => {
    setSearchState(initialSearchState);
    setIsSearchActive(false);
  }, []);

  const filteredEmails = useMemo(() => {
    let result = emails.filter((email) => {
      const matchesFolder = email.folder === currentFolder;
      
      let matchesSearch = true;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        matchesSearch = 
          email.subject.toLowerCase().includes(query) ||
          email.from.name.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query);
      }
      
      let matchesCategory = true;
      if (activeCategory && currentFolder === 'inbox') {
        matchesCategory = email.category === activeCategory;
      }
      
      return matchesFolder && matchesSearch && matchesCategory;
    });

    if (sortOrder === 'newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'unread') {
      result.sort((a, b) => {
        if (a.read === b.read) return new Date(b.date) - new Date(a.date);
        return a.read ? 1 : -1;
      });
    } else if (sortOrder === 'starred') {
      result.sort((a, b) => {
        if (a.starred === b.starred) return new Date(b.date) - new Date(a.date);
        return a.starred ? -1 : 1;
      });
    } else if (sortOrder === 'attachments') {
      result.sort((a, b) => {
        const aHasAttach = (a.attachments?.length || 0) > 0;
        const bHasAttach = (b.attachments?.length || 0) > 0;
        if (aHasAttach === bHasAttach) return new Date(b.date) - new Date(a.date);
        return aHasAttach ? -1 : 1;
      });
    }

    return result;
  }, [emails, currentFolder, searchQuery, activeCategory, sortOrder]);

  const starredEmails = useMemo(() => {
    return emails.filter(email => email.starred && email.folder !== 'trash' && email.folder !== 'spam');
  }, [emails]);

  const markAsRead = useCallback((emailId) => {
    setEmails(prev =>
      prev.map(email => email.id === emailId ? { ...email, read: true } : email)
    );
  }, []);

  const markAsUnread = useCallback((emailId) => {
    setEmails(prev =>
      prev.map(email => email.id === emailId ? { ...email, read: false } : email)
    );
  }, []);

  const toggleStar = useCallback((emailId) => {
    setEmails(prev =>
      prev.map(email => email.id === emailId ? { ...email, starred: !email.starred } : email)
    );
  }, []);

  const deleteEmail = useCallback((emailId) => {
    setEmails(prev =>
      prev.map(email => email.id === emailId ? { ...email, folder: 'trash' } : email)
    );
    setSelectedEmail(null);
  }, []);

  const permanentlyDelete = useCallback((emailId) => {
    setEmails(prev => prev.filter(email => email.id !== emailId));
  }, []);

  const moveToFolder = useCallback((emailId, folder) => {
    setEmails(prev =>
      prev.map(email => email.id === emailId ? { ...email, folder } : email)
    );
  }, []);

  const archiveEmail = useCallback((emailId) => {
    setEmails(prev =>
      prev.map(email => email.id === emailId ? { ...email, folder: 'archive' } : email)
    );
    setSelectedEmail(null);
  }, []);

  const markAllAsRead = useCallback(() => {
    setEmails(prev =>
      prev.map(email => email.folder === currentFolder ? { ...email, read: true } : email)
    );
  }, [currentFolder]);

  const addLabel = useCallback((emailId, labelId) => {
    setEmails(prev =>
      prev.map(email => 
        email.id === emailId 
          ? { ...email, labels: [...email.labels, labelId] } 
          : email
      )
    );
  }, []);

  const removeLabel = useCallback((emailId, labelId) => {
    setEmails(prev =>
      prev.map(email => 
        email.id === emailId 
          ? { ...email, labels: email.labels.filter(l => l !== labelId) } 
          : email
      )
    );
  }, []);

  const sendEmail = useCallback((email) => {
    const newEmail = {
      ...email,
      id: `email-${Date.now()}`,
      threadId: email.threadId || `thread-${Date.now()}`,
      from: { name: currentUser.name, email: currentUser.email },
      to: email.to,
      cc: email.cc || [],
      date: new Date(),
      read: true,
      starred: false,
      folder: 'sent',
    };
    setEmails(prev => [newEmail, ...prev]);
  }, []);

  const getThread = useCallback((threadId) => {
    return threads[threadId] || null;
  }, [threads]);

  const getActiveThread = useCallback(() => {
    if (!selectedEmail || !selectedEmail.threadId) return null;
    return threads[selectedEmail.threadId] || null;
  }, [selectedEmail, threads]);

  const value = {
    emails: filteredEmails,
    allEmails: emails,
    selectedEmail,
    setSelectedEmail,
    currentFolder,
    setCurrentFolder,
    labels,
    contacts,
    tasks,
    calendarEvents,
    currentUser,
    accounts,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortOrder,
    setSortOrder,
    density,
    setDensity,
    conversationView,
    setConversationView,
    isLoading,
    setIsLoading,
    starredEmails,
    threads,
    getThread,
    getActiveThread,
    markAsRead,
    markAsUnread,
    toggleStar,
    deleteEmail,
    permanentlyDelete,
    moveToFolder,
    archiveEmail,
    markAllAsRead,
    addLabel,
    removeLabel,
    sendEmail,
    searchState,
    setSearchState,
    searchHistory,
    savedSearches,
    isSearchActive,
    setIsSearchActive,
    showAdvancedSearch,
    setShowAdvancedSearch,
    searchResults,
    quickFilterResults,
    addToHistory,
    clearSearchHistory,
    saveSearch,
    deleteSavedSearch,
    applySearch,
    clearSearch,
    performSearch,
  };

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
}

export function useMail() {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMail must be used within a MailProvider');
  }
  return context;
}