import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { emails as initialEmails, labels, contacts, tasks, calendarEvents, currentUser } from '../data/mock';

const MailContext = createContext(null);

export function MailProvider({ children }) {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('primary');
  const [sortOrder, setSortOrder] = useState('newest');
  const [conversationView, setConversationView] = useState(true);

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
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortOrder,
    setSortOrder,
    conversationView,
    setConversationView,
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