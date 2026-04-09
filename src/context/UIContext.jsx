import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UIContext = createContext(null);

const TIMEZONES = [
  { id: 'America/New_York', label: 'Eastern Time (ET)' },
  { id: 'America/Chicago', label: 'Central Time (CT)' },
  { id: 'America/Denver', label: 'Mountain Time (MT)' },
  { id: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { id: 'Europe/London', label: 'GMT (London)' },
  { id: 'Europe/Paris', label: 'Central European Time' },
  { id: 'Asia/Tokyo', label: 'Japan Standard Time' },
  { id: 'Asia/Kolkata', label: 'India Standard Time' },
  { id: 'Australia/Sydney', label: 'Australian Eastern Time' },
];

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'fr', label: 'Français' },
  { id: 'de', label: 'Deutsch' },
  { id: 'it', label: 'Italiano' },
  { id: 'pt', label: 'Português' },
  { id: 'zh', label: '中文' },
  { id: 'ja', label: '日本語' },
];

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('calendar');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeMaximized, setComposeMaximized] = useState(false);
  const [activeView, setActiveView] = useState('inbox');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [settingsTab, setSettingsTab] = useState('general');
  const [drafts, setDrafts] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [composeMinimized, setComposeMinimized] = useState(false);

  const [language, setLanguage] = useState(() => localStorage.getItem('flowmail-language') || 'en');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('flowmail-timezone') || 'Asia/Kolkata');
  const [conversationView, setConversationView] = useState(() => {
    const stored = localStorage.getItem('flowmail-conversation-view');
    return stored !== null ? stored === 'true' : true;
  });
  const [focusedInboxEnabled, setFocusedInboxEnabled] = useState(() => {
    const stored = localStorage.getItem('flowmail-focused-inbox');
    return stored !== null ? stored === 'true' : true;
  });
  const [density, setDensity] = useState(() => localStorage.getItem('flowmail-density') || 'comfortable');
  const [undoDuration, setUndoDuration] = useState(() => {
    const stored = localStorage.getItem('flowmail-undo-duration');
    return stored ? parseInt(stored) : 30;
  });
  const [defaultReplyBehavior, setDefaultReplyBehavior] = useState(() => localStorage.getItem('flowmail-default-reply') || 'reply');
  const [readingPanePosition, setReadingPanePosition] = useState(() => localStorage.getItem('flowmail-reading-pane') || 'right');
  const [previewLines, setPreviewLines] = useState(() => {
    const stored = localStorage.getItem('flowmail-preview-lines');
    return stored ? parseInt(stored) : 2;
  });
  const [desktopNotifications, setDesktopNotifications] = useState(() => {
    const stored = localStorage.getItem('flowmail-desktop-notifications');
    return stored !== null ? stored === 'true' : true;
  });
  const [notificationSound, setNotificationSound] = useState(() => {
    const stored = localStorage.getItem('flowmail-notification-sound');
    return stored !== null ? stored === 'true' : false;
  });
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    const stored = localStorage.getItem('flowmail-reminders');
    return stored !== null ? stored === 'true' : true;
  });
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(() => {
    const stored = localStorage.getItem('flowmail-keyboard-shortcuts');
    return stored !== null ? stored === 'true' : true;
  });
  const [categoryTabsEnabled, setCategoryTabsEnabled] = useState(() => {
    const stored = localStorage.getItem('flowmail-category-tabs');
    return stored !== null ? stored === 'true' : true;
  });
  const [importanceMarkers, setImportanceMarkers] = useState(() => {
    const stored = localStorage.getItem('flowmail-importance-markers');
    return stored !== null ? stored === 'true' : true;
  });
  const [sendArchiveEnabled, setSendArchiveEnabled] = useState(() => {
    const stored = localStorage.getItem('flowmail-send-archive');
    return stored !== null ? stored === 'true' : true;
  });
  const [externalImagesWarning, setExternalImagesWarning] = useState(() => {
    const stored = localStorage.getItem('flowmail-external-images');
    return stored !== null ? stored === 'true' : true;
  });
  const [trackingPixelWarning, setTrackingPixelWarning] = useState(() => {
    const stored = localStorage.getItem('flowmail-tracking-warning');
    return stored !== null ? stored === 'true' : true;
  });
  const [downloadWarning, setDownloadWarning] = useState(() => {
    const stored = localStorage.getItem('flowmail-download-warning');
    return stored !== null ? stored === 'true' : true;
  });
  const [defaultInbox, setDefaultInbox] = useState(() => localStorage.getItem('flowmail-default-inbox') || 'primary');

  useEffect(() => localStorage.setItem('flowmail-language', language), [language]);
  useEffect(() => localStorage.setItem('flowmail-timezone', timezone), [timezone]);
  useEffect(() => localStorage.setItem('flowmail-conversation-view', conversationView), [conversationView]);
  useEffect(() => localStorage.setItem('flowmail-focused-inbox', focusedInboxEnabled), [focusedInboxEnabled]);
  useEffect(() => localStorage.setItem('flowmail-density', density), [density]);
  useEffect(() => localStorage.setItem('flowmail-undo-duration', undoDuration), [undoDuration]);
  useEffect(() => localStorage.setItem('flowmail-default-reply', defaultReplyBehavior), [defaultReplyBehavior]);
  useEffect(() => localStorage.setItem('flowmail-reading-pane', readingPanePosition), [readingPanePosition]);
  useEffect(() => localStorage.setItem('flowmail-preview-lines', previewLines), [previewLines]);
  useEffect(() => localStorage.setItem('flowmail-desktop-notifications', desktopNotifications), [desktopNotifications]);
  useEffect(() => localStorage.setItem('flowmail-notification-sound', notificationSound), [notificationSound]);
  useEffect(() => localStorage.setItem('flowmail-reminders', remindersEnabled), [remindersEnabled]);
  useEffect(() => localStorage.setItem('flowmail-keyboard-shortcuts', keyboardShortcuts), [keyboardShortcuts]);
  useEffect(() => localStorage.setItem('flowmail-category-tabs', categoryTabsEnabled), [categoryTabsEnabled]);
  useEffect(() => localStorage.setItem('flowmail-importance-markers', importanceMarkers), [importanceMarkers]);
  useEffect(() => localStorage.setItem('flowmail-send-archive', sendArchiveEnabled), [sendArchiveEnabled]);
  useEffect(() => localStorage.setItem('flowmail-external-images', externalImagesWarning), [externalImagesWarning]);
  useEffect(() => localStorage.setItem('flowmail-tracking-warning', trackingPixelWarning), [trackingPixelWarning]);
  useEffect(() => localStorage.setItem('flowmail-download-warning', downloadWarning), [downloadWarning]);
  useEffect(() => localStorage.setItem('flowmail-default-inbox', defaultInbox), [defaultInbox]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleRightPanel = useCallback(() => setRightPanelOpen(prev => !prev), []);
  const openCompose = useCallback(() => setComposeOpen(true), []);
  const closeCompose = useCallback(() => setComposeOpen(false), []);
  const toggleComposeMaximized = useCallback(() => setComposeMaximized(prev => !prev), []);
  const goToSettings = useCallback((tab) => { if (tab) setSettingsTab(tab); setCurrentView('settings'); }, []);
  const goToContacts = useCallback(() => setCurrentView('contacts'), []);
  const goToSearch = useCallback(() => setCurrentView('search'), []);
  const goToMain = useCallback(() => setCurrentView('main'), []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const selectEmail = useCallback((emailId) => {
    setSelectedEmails(prev => [...prev, emailId]);
  }, []);

  const deselectEmail = useCallback((emailId) => {
    setSelectedEmails(prev => prev.filter(id => id !== emailId));
  }, []);

  const toggleSelectEmail = useCallback((emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  }, []);

  const selectAll = useCallback((emailIds) => {
    setSelectedEmails(emailIds);
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedEmails([]);
  }, []);

  const value = {
    sidebarOpen,
    setSidebarOpen,
    rightPanelOpen,
    setRightPanelOpen,
    rightPanelTab,
    setRightPanelTab,
    composeOpen,
    setComposeOpen,
    composeMaximized,
    setComposeMaximized,
    activeView,
    setActiveView,
    density,
    setDensity,
    selectedEmails,
    selectEmail,
    deselectEmail,
    toggleSelectEmail,
    selectAll,
    deselectAll,
    toasts,
    addToast,
    removeToast,
    toggleSidebar,
    toggleRightPanel,
    openCompose,
    closeCompose,
    toggleComposeMaximized,
    commandPaletteOpen,
    setCommandPaletteOpen,
    shortcutsOpen,
    setShortcutsOpen,
    currentView,
    setCurrentView,
    settingsTab,
    setSettingsTab,
    goToSettings,
    goToContacts,
    goToSearch,
    goToMain,
    drafts,
    setDrafts,
    activeDraftId,
    setActiveDraftId,
    composeMinimized,
    setComposeMinimized,
    language,
    setLanguage,
    languages: LANGUAGES,
    timezone,
    setTimezone,
    timezones: TIMEZONES,
    conversationView,
    setConversationView,
    focusedInboxEnabled,
    setFocusedInboxEnabled,
    undoDuration,
    setUndoDuration,
    defaultReplyBehavior,
    setDefaultReplyBehavior,
    readingPanePosition,
    setReadingPanePosition,
    previewLines,
    setPreviewLines,
    desktopNotifications,
    setDesktopNotifications,
    notificationSound,
    setNotificationSound,
    remindersEnabled,
    setRemindersEnabled,
    keyboardShortcuts,
    setKeyboardShortcuts,
    categoryTabsEnabled,
    setCategoryTabsEnabled,
    importanceMarkers,
    setImportanceMarkers,
    sendArchiveEnabled,
    setSendArchiveEnabled,
    externalImagesWarning,
    setExternalImagesWarning,
    trackingPixelWarning,
    setTrackingPixelWarning,
    downloadWarning,
    setDownloadWarning,
    defaultInbox,
    setDefaultInbox,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}