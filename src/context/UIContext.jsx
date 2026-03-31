import { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightPanelTab, setRightPanelTab] = useState('calendar');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeMaximized, setComposeMaximized] = useState(false);
  const [activeView, setActiveView] = useState('inbox');
  const [density, setDensity] = useState('comfortable');
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [toasts, setToasts] = useState([]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleRightPanel = useCallback(() => setRightPanelOpen(prev => !prev), []);
  const openCompose = useCallback(() => setComposeOpen(true), []);
  const closeCompose = useCallback(() => setComposeOpen(false), []);
  const toggleComposeMaximized = useCallback(() => setComposeMaximized(prev => !prev), []);

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