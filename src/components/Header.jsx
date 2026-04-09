import { useState, useRef, useEffect } from 'react';
import { Bell, Settings, Menu, Sun, Moon, Plus, ChevronDown, Inbox, Check, X } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Button } from './ui';
import { SearchBar } from './search/SearchBar';
import './Header.css';

export function Header({ onMenuClick }) {
  const { searchQuery, setSearchQuery, isSearchActive, setIsSearchActive, accounts, activeAccountId, unifiedInboxEnabled, switchAccount, toggleUnifiedInbox, getActiveAccount } = useMail();
  const { openCompose, goToSettings } = useUI();
  const { theme, toggleTheme } = useTheme();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    if (query) {
      setIsSearchActive(true);
    }
  };

  const activeAccount = getActiveAccount();
  const initials = activeAccount?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <header className="header">
      <div className="header-left">
        <Button variant="ghost" size="sm" className="menu-btn" onClick={onMenuClick}>
          <Menu size={18} />
        </Button>
        <div className="logo">
          <span className="logo-icon">📧</span>
          <span className="logo-text">Flowmail</span>
        </div>
      </div>

      <div className="header-search">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search emails..."
        />
      </div>

      <div className="header-right">
        <Button variant="primary" size="sm" className="compose-btn-header" onClick={openCompose}>
          <Plus size={16} />
          <span>Compose</span>
        </Button>
        <Button variant="ghost" size="sm" className="icon-btn" title="Notifications">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="sm" className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
        <Button variant="ghost" size="sm" className="icon-btn" onClick={() => goToSettings()} title="Settings">
          <Settings size={18} />
        </Button>
        
        <div className="account-switcher" ref={menuRef}>
          <button className="account-btn" onClick={() => setShowAccountMenu(!showAccountMenu)}>
            <div className="account-avatar" style={{ backgroundColor: activeAccount?.color || '#4361ee' }}>
              {initials}
            </div>
            <ChevronDown size={14} className="account-chevron" />
          </button>
          
          {showAccountMenu && (
            <div className="account-menu">
              <div className="account-menu-header">
                <span>Select account</span>
                <button className="close-menu" onClick={() => setShowAccountMenu(false)}>
                  <X size={14} />
                </button>
              </div>
              
              <div className="account-menu-section">
                <button 
                  className={`account-menu-item ${unifiedInboxEnabled ? 'active' : ''}`}
                  onClick={() => {
                    toggleUnifiedInbox();
                    setShowAccountMenu(false);
                  }}
                >
                  <div className="account-menu-avatar unified" style={{ backgroundColor: '#6366f1' }}>
                    <Inbox size={14} />
                  </div>
                  <div className="account-menu-info">
                    <span className="account-menu-name">All accounts</span>
                    <span className="account-menu-email-small">Unified inbox</span>
                  </div>
                  {unifiedInboxEnabled && <Check size={14} className="check-icon" />}
                </button>
              </div>
              
              <div className="account-menu-divider" />
              
              <div className="account-menu-section">
                {accounts.map((account) => (
                  <button 
                    key={account.id}
                    className={`account-menu-item ${!unifiedInboxEnabled && activeAccountId === account.id ? 'active' : ''}`}
                    onClick={() => {
                      switchAccount(account.id);
                      setShowAccountMenu(false);
                    }}
                  >
                    <div className="account-menu-avatar" style={{ backgroundColor: account.color }}>
                      {account.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="account-menu-info">
                      <span className="account-menu-name">{account.name}</span>
                      <span className="account-menu-email-small">{account.email}</span>
                    </div>
                    {!unifiedInboxEnabled && activeAccountId === account.id && <Check size={14} className="check-icon" />}
                  </button>
                ))}
              </div>
              
              <div className="account-menu-footer">
                <button className="account-add-btn">
                  <Plus size={16} />
                  Add account
                </button>
                <button className="account-manage-btn" onClick={() => { goToSettings(); setShowAccountMenu(false); }}>
                  Manage accounts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}