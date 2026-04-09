import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { emails as initialEmails, labels as initialLabels, contacts as initialContacts, contactGroups, tasks as initialTasks, calendarEvents as initialCalendarEvents, notes as initialNotes, reminders as initialReminders, currentUser, accounts as mockAccounts } from '../data/mock';

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

const defaultCategories = [
  { id: 'primary', name: 'Primary', visible: true, focused: true, order: 0 },
  { id: 'social', name: 'Social', visible: true, focused: false, order: 1 },
  { id: 'updates', name: 'Updates', visible: true, focused: false, order: 2 },
  { id: 'promotions', name: 'Promotions', visible: true, focused: false, order: 3 },
  { id: 'forums', name: 'Forums', visible: true, focused: false, order: 4 },
  { id: 'team', name: 'Team', visible: true, focused: true, order: 5 },
];

const enhancedLabels = initialLabels.map((label, index) => ({
  ...label,
  parentId: null,
  visible: true,
  order: index,
}));

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
  
  const [labels, setLabels] = useState(enhancedLabels);
  const [categories, setCategories] = useState(defaultCategories);
  const [focusedInboxEnabled, setFocusedInboxEnabled] = useState(true);
  
  const [accounts, setAccounts] = useState(mockAccounts);
  const [activeAccountId, setActiveAccountId] = useState(mockAccounts[0]?.id || 'account-1');
  const [unifiedInboxEnabled, setUnifiedInboxEnabled] = useState(false);
  
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContact, setSelectedContact] = useState(null);
  
  const [tasks, setTasks] = useState(initialTasks);
  const [calendarEvents, setCalendarEvents] = useState(initialCalendarEvents);
  const [notes, setNotes] = useState(initialNotes);
  const [reminders, setReminders] = useState(initialReminders);
  
  const [searchState, setSearchState] = useState(initialSearchState);
  const [searchHistory, setSearchHistory] = useState([
    { id: '1', query: 'Q4 design', date: '2026-04-01' },
    { id: '2', query: 'invoice', date: '2026-03-30' },
    { id: '3', query: 'team standup', date: '2026-03-28' },
  ]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const [rules, setRules] = useState([
    {
      id: 'rule-1',
      name: 'Label invoices',
      enabled: true,
      priority: 1,
      matchAll: false,
      conditions: [{ field: 'subject', operator: 'contains', value: 'invoice', not: false }],
      actions: [{ type: 'label', value: 'finance' }],
      createdAt: '2026-04-01',
      lastUsed: null,
    },
    {
      id: 'rule-2',
      name: 'Move newsletters to Promotions',
      enabled: true,
      priority: 2,
      matchAll: false,
      conditions: [{ field: 'subject', operator: 'contains', value: 'newsletter', not: false }],
      actions: [{ type: 'category', value: 'promotions' }],
      createdAt: '2026-04-01',
      lastUsed: null,
    },
    {
      id: 'rule-3',
      name: 'Flag client emails',
      enabled: false,
      priority: 3,
      matchAll: false,
      conditions: [{ field: 'from', operator: 'contains', value: 'client', not: false }],
      actions: [{ type: 'flag', value: 'follow-up' }],
      createdAt: '2026-04-01',
      lastUsed: null,
    },
    {
      id: 'rule-4',
      name: 'Auto-archive notifications',
      enabled: true,
      priority: 4,
      matchAll: false,
      conditions: [{ field: 'subject', operator: 'contains', value: 'notification', not: false }],
      actions: [{ type: 'archive', value: '' }],
      createdAt: '2026-04-01',
      lastUsed: null,
    },
    {
      id: 'rule-5',
      name: 'Important from CEO',
      enabled: true,
      priority: 5,
      matchAll: false,
      conditions: [{ field: 'from', operator: 'contains', value: 'ceo@', not: false }],
      actions: [{ type: 'markImportant', value: '' }],
      createdAt: '2026-04-01',
      lastUsed: null,
    },
  ]);

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
    const totalMB = (bytes) => bytes / (1024 * 1024);
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
            case 'yesterday': {
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              return emailDate.toDateString() === yesterday.toDateString();
            }
            case 'this_week': {
              const weekAgo = new Date(now);
              weekAgo.setDate(weekAgo.getDate() - 7);
              return emailDate >= weekAgo;
            }
            case 'this_month': {
              const monthAgo = new Date(now);
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return emailDate >= monthAgo;
            }
            case 'older': {
              const monthAgoOld = new Date(now);
              monthAgoOld.setMonth(monthAgoOld.getMonth() - 1);
              return emailDate < monthAgoOld;
            }
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

  const checkCondition = useCallback((email, condition) => {
    const { field, operator, value, not } = condition;
    let matches = false;
    const lowerValue = value.toLowerCase();

    switch (field) {
      case 'from':
        if (operator === 'contains') {
          matches = email.from.name.toLowerCase().includes(lowerValue) || 
                    email.from.email.toLowerCase().includes(lowerValue);
        } else if (operator === 'equals') {
          matches = email.from.name.toLowerCase() === lowerValue || 
                    email.from.email.toLowerCase() === lowerValue;
        }
        break;
      case 'to':
        if (operator === 'contains') {
          matches = email.to.some(t => t.name.toLowerCase().includes(lowerValue) || 
                                    t.email.toLowerCase().includes(lowerValue));
        } else if (operator === 'equals') {
          matches = email.to.some(t => t.name.toLowerCase() === lowerValue || 
                                  t.email.toLowerCase() === lowerValue);
        }
        break;
      case 'subject':
        if (operator === 'contains') {
          matches = email.subject.toLowerCase().includes(lowerValue);
        } else if (operator === 'equals') {
          matches = email.subject.toLowerCase() === lowerValue;
        }
        break;
      case 'body':
        if (operator === 'contains') {
          const plainBody = email.body.replace(/<[^>]*>/g, '').toLowerCase();
          matches = plainBody.includes(lowerValue);
        }
        break;
      case 'hasAttachment':
        matches = (email.attachments && email.attachments.length > 0);
        if (value === 'false') matches = !matches;
        break;
      case 'size': {
        const sizeMB = (email.attachments || []).reduce((acc, att) => acc + (att.size || 0), 0) / (1024 * 1024);
        if (operator === 'greaterThan') matches = sizeMB > parseFloat(value);
        else if (operator === 'lessThan') matches = sizeMB < parseFloat(value);
        break;
      }
      case 'read':
        matches = email.read === (value === 'true');
        break;
      case 'starred':
        matches = email.starred === (value === 'true');
        break;
      case 'priority':
        matches = email.priority === value;
        break;
      case 'category':
        matches = email.category === value;
        break;
      case 'label':
        matches = email.labels.includes(value);
        break;
      case 'senderDomain': {
        const domain = email.from.email.split('@')[1]?.toLowerCase() || '';
        matches = domain.includes(lowerValue);
        break;
      }
      default:
        matches = false;
    }

    return not ? !matches : matches;
  }, []);

  const applyRuleToEmail = useCallback((email, rule) => {
    const { conditions, matchAll, actions } = rule;
    
    const conditionsMatch = matchAll 
      ? conditions.every(c => checkCondition(email, c))
      : conditions.some(c => checkCondition(email, c));

    if (!conditionsMatch) return null;

    return actions;
  }, [checkCondition]);

  const applyAllRules = useCallback((email) => {
    const enabledRules = rules.filter(r => r.enabled).sort((a, b) => a.priority - b.priority);
    
    for (const rule of enabledRules) {
      const actions = applyRuleToEmail(email, rule);
      if (actions) {
        return { rule, actions };
      }
    }
    return null;
  }, [rules, applyRuleToEmail]);

  const getMatchingEmailsForRule = useCallback((ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return [];
    
    return emails.filter(email => {
      const result = applyRuleToEmail(email, rule);
      return result !== null;
    });
  }, [rules, emails, applyRuleToEmail]);

  const createRule = useCallback((rule) => {
    const newRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    setRules(prev => [...prev, newRule]);
    return newRule;
  }, []);

  const updateRule = useCallback((ruleId, updates) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
  }, []);

  const deleteRule = useCallback((ruleId) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  }, []);

  const toggleRule = useCallback((ruleId) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  }, []);

  const duplicateRule = useCallback((ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;
    
    const newRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (copy)`,
      priority: rules.length + 1,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    setRules(prev => [...prev, newRule]);
  }, [rules]);

  const reorderRules = useCallback((fromIndex, toIndex) => {
    setRules(prev => {
      const newRules = [...prev];
      const [removed] = newRules.splice(fromIndex, 1);
      newRules.splice(toIndex, 0, removed);
      return newRules.map((r, i) => ({ ...r, priority: i + 1 }));
    });
  }, []);

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

  const toggleContactFavorite = useCallback((contactId) => {
    setContacts(prev =>
      prev.map(c => c.id === contactId ? { ...c, isFavorite: !c.isFavorite } : c)
    );
  }, []);

  const addContact = useCallback((contact) => {
    const newContact = {
      ...contact,
      id: `contact-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
    };
    setContacts(prev => [...prev, newContact]);
  }, []);

  const updateContact = useCallback((contactId, updates) => {
    setContacts(prev =>
      prev.map(c => c.id === contactId ? { ...c, ...updates } : c)
    );
  }, []);

  const deleteContact = useCallback((contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  }, []);

  const addTagToContact = useCallback((contactId, tag) => {
    setContacts(prev =>
      prev.map(c => c.id === contactId && !c.tags.includes(tag) ? { ...c, tags: [...c.tags, tag] } : c)
    );
  }, []);

  const removeTagFromContact = useCallback((contactId, tag) => {
    setContacts(prev =>
      prev.map(c => c.id === contactId ? { ...c, tags: c.tags.filter(t => t !== tag) } : c)
    );
  }, []);

  const getRecentContacts = useCallback((limit = 5) => {
    return [...contacts]
      .filter(c => c.lastInteraction)
      .sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction))
      .slice(0, limit);
  }, [contacts]);

  const searchContacts = useCallback((query) => {
    if (!query) return [];
    const q = query.toLowerCase();
    return contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.organization?.toLowerCase().includes(q)
    );
  }, [contacts]);

  const getContactByEmail = useCallback((email) => {
    return contacts.find(c => c.email.toLowerCase() === email.toLowerCase());
  }, [contacts]);

  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const toggleTaskComplete = useCallback((taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  }, []);

  const createTaskFromEmail = useCallback((emailId, title) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      completed: false,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      priority: 'medium',
      linkedEmailId: emailId,
      linkedContactId: null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  }, []);

  const addNote = useCallback((note) => {
    const newNote = {
      ...note,
      id: `note-${Date.now()}`,
      pinned: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const updateNote = useCallback((noteId, updates) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : n));
  }, []);

  const deleteNote = useCallback((noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  const toggleNotePin = useCallback((noteId) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n));
  }, []);

  const createNoteFromEmail = useCallback((emailId, content) => {
    const newNote = {
      id: `note-${Date.now()}`,
      content,
      pinned: false,
      linkedEmailId: emailId,
      linkedContactId: null,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  }, []);

  const snoozeEmail = useCallback((emailId, snoozeUntil, notes = '') => {
    const newReminder = {
      id: `reminder-${Date.now()}`,
      emailId,
      snoozeUntil,
      notes,
    };
    setReminders(prev => [...prev, newReminder]);
    return newReminder;
  }, []);

  const unsnoozeEmail = useCallback((emailId) => {
    setReminders(prev => prev.filter(r => r.emailId !== emailId));
  }, []);

  const getSnoozedEmails = useCallback(() => {
    return reminders.filter(r => new Date(r.snoozeUntil) > new Date());
  }, [reminders]);

  const getUpcomingReminders = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(r => r.snoozeUntil >= today).sort((a, b) => new Date(a.snoozeUntil) - new Date(b.snoozeUntil));
  }, [reminders]);

  const getTodoTasks = useCallback(() => {
    return tasks.filter(t => !t.completed);
  }, [tasks]);

  const getCompletedTasks = useCallback(() => {
    return tasks.filter(t => t.completed);
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => !t.completed && t.dueDate < today);
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => !t.completed && t.dueDate === today);
  }, [tasks]);

  const getUpcomingTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => !t.completed && t.dueDate > today).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  const getPinnedNotes = useCallback(() => {
    return notes.filter(n => n.pinned);
  }, [notes]);

  const addCalendarEvent = useCallback((event) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const filteredEmails = useMemo(() => {
    let result = emails.filter((email) => {
      const matchesAccount = unifiedInboxEnabled || email.accountId === activeAccountId;
      
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
      
      return matchesAccount && matchesFolder && matchesSearch && matchesCategory;
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
  }, [emails, currentFolder, searchQuery, activeCategory, sortOrder, activeAccountId, unifiedInboxEnabled]);

  const starredEmails = useMemo(() => {
    return emails.filter(email => email.starred && email.folder !== 'trash' && email.folder !== 'spam');
  }, [emails]);

  const getActiveAccount = useCallback(() => {
    return accounts.find(a => a.id === activeAccountId) || accounts[0];
  }, [activeAccountId, accounts]);

  const switchAccount = useCallback((accountId) => {
    setActiveAccountId(accountId);
    setUnifiedInboxEnabled(false);
  }, []);

  const toggleUnifiedInbox = useCallback(() => {
    setUnifiedInboxEnabled(prev => !prev);
  }, []);

  const getAccountById = useCallback((accountId) => {
    return accounts.find(a => a.id === accountId);
  }, [accounts]);

  const getAccountColor = useCallback((emailAccountId) => {
    const account = accounts.find(a => a.id === emailAccountId);
    return account?.color || '#6b7280';
  }, [accounts]);

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

  const addLabelToEmail = useCallback((emailId, labelId) => {
    setEmails(prev =>
      prev.map(email => 
        email.id === emailId && !email.labels.includes(labelId)
          ? { ...email, labels: [...email.labels, labelId] } 
          : email
      )
    );
  }, []);

  const removeLabelFromEmail = useCallback((emailId, labelId) => {
    setEmails(prev =>
      prev.map(email => 
        email.id === emailId 
          ? { ...email, labels: email.labels.filter(l => l !== labelId) } 
          : email
      )
    );
  }, []);

  const addLabelToMultiple = useCallback((emailIds, labelId) => {
    setEmails(prev =>
      prev.map(email => 
        emailIds.includes(email.id) && !email.labels.includes(labelId)
          ? { ...email, labels: [...email.labels, labelId] } 
          : email
      )
    );
  }, []);

  const removeLabelFromMultiple = useCallback((emailIds, labelId) => {
    setEmails(prev =>
      prev.map(email => 
        emailIds.includes(email.id)
          ? { ...email, labels: email.labels.filter(l => l !== labelId) } 
          : email
      )
    );
  }, []);

  const createLabel = useCallback((name, color, parentId = null) => {
    const newLabel = {
      id: `label-${Date.now()}`,
      name,
      color,
      parentId,
      visible: true,
      order: labels.length,
      emailCount: 0,
    };
    setLabels(prev => [...prev, newLabel]);
    return newLabel;
  }, [labels.length]);

  const updateLabel = useCallback((labelId, updates) => {
    setLabels(prev =>
      prev.map(label => 
        label.id === labelId 
          ? { ...label, ...updates } 
          : label
      )
    );
  }, []);

  const deleteLabel = useCallback((labelId) => {
    setLabels(prev => prev.filter(label => label.id !== labelId));
    setEmails(prev =>
      prev.map(email => 
        email.labels.includes(labelId)
          ? { ...email, labels: email.labels.filter(l => l !== labelId) } 
          : email
      )
    );
  }, []);

  const toggleLabelVisibility = useCallback((labelId) => {
    setLabels(prev =>
      prev.map(label => 
        label.id === labelId 
          ? { ...label, visible: !label.visible } 
          : label
      )
    );
  }, []);

  const reorderLabels = useCallback((fromIndex, toIndex) => {
    setLabels(prev => {
      const newLabels = [...prev];
      const [removed] = newLabels.splice(fromIndex, 1);
      newLabels.splice(toIndex, 0, removed);
      return newLabels.map((label, index) => ({ ...label, order: index }));
    });
  }, []);

  const updateCategory = useCallback((categoryId, updates) => {
    setCategories(prev =>
      prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, ...updates } 
          : cat
      )
    );
  }, []);

  const reorderCategories = useCallback((fromIndex, toIndex) => {
    setCategories(prev => {
      const newCategories = [...prev];
      const [removed] = newCategories.splice(fromIndex, 1);
      newCategories.splice(toIndex, 0, removed);
      return newCategories.map((cat, index) => ({ ...cat, order: index }));
    });
  }, []);

  const toggleFocusedInbox = useCallback(() => {
    setFocusedInboxEnabled(prev => !prev);
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
    categories,
    focusedInboxEnabled,
    currentUser,
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
    activeAccountId,
    unifiedInboxEnabled,
    getActiveAccount,
    switchAccount,
    toggleUnifiedInbox,
    getAccountById,
    getAccountColor,
    contacts,
    contactGroups,
    selectedContact,
    setSelectedContact,
    toggleContactFavorite,
    addContact,
    updateContact,
    deleteContact,
    addTagToContact,
    removeTagFromContact,
    getRecentContacts,
    searchContacts,
    getContactByEmail,
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
    addLabelToEmail,
    removeLabelFromEmail,
    addLabelToMultiple,
    removeLabelFromMultiple,
    createLabel,
    updateLabel,
    deleteLabel,
    toggleLabelVisibility,
    reorderLabels,
    updateCategory,
    reorderCategories,
    toggleFocusedInbox,
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
    applyAllRules,
    getMatchingEmailsForRule,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    duplicateRule,
    reorderRules,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    createTaskFromEmail,
    getTodoTasks,
    getCompletedTasks,
    getOverdueTasks,
    getTodayTasks,
    getUpcomingTasks,
    calendarEvents,
    addCalendarEvent,
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleNotePin,
    createNoteFromEmail,
    getPinnedNotes,
    reminders,
    snoozeEmail,
    unsnoozeEmail,
    getSnoozedEmails,
    getUpcomingReminders,
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