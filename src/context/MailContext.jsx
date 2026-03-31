import { createContext, useContext, useState, useCallback } from 'react';
import { emails as initialEmails, labels, currentUser } from '../data/mock';

const MailContext = createContext(null);

export function MailProvider({ children }) {
  const [emails, setEmails] = useState(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter((email) => {
    const matchesFolder = email.folder === currentFolder;
    const matchesSearch =
      searchQuery === '' ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const markAsRead = useCallback((emailId) => {
    setEmails((prev) =>
      prev.map((email) => (email.id === emailId ? { ...email, read: true } : email))
    );
  }, []);

  const toggleStar = useCallback((emailId) => {
    setEmails((prev) =>
      prev.map((email) => (email.id === emailId ? { ...email, starred: !email.starred } : email))
    );
  }, []);

  const deleteEmail = useCallback((emailId) => {
    setEmails((prev) =>
      prev.map((email) => (email.id === emailId ? { ...email, folder: 'trash' } : email))
    );
    setSelectedEmail(null);
  }, []);

  const moveToFolder = useCallback((emailId, folder) => {
    setEmails((prev) =>
      prev.map((email) => (email.id === emailId ? { ...email, folder } : email))
    );
  }, []);

  const sendEmail = useCallback((email) => {
    const newEmail = {
      ...email,
      id: String(Date.now()),
      from: { name: currentUser.name, email: currentUser.email },
      to: email.to,
      date: new Date(),
      read: true,
      starred: false,
      folder: 'sent',
      labels: [],
    };
    setEmails((prev) => [newEmail, ...prev]);
  }, []);

  const value = {
    emails: filteredEmails,
    allEmails: emails,
    selectedEmail,
    setSelectedEmail,
    currentFolder,
    setCurrentFolder,
    labels,
    currentUser,
    searchQuery,
    setSearchQuery,
    markAsRead,
    toggleStar,
    deleteEmail,
    moveToFolder,
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