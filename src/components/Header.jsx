import { useState } from 'react';
import { Search, Bell, Settings, Menu, Sun, Moon, Plus, ChevronDown, User } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Button } from './ui';
import './Header.css';

export function Header({ onMenuClick }) {
  const { currentUser, searchQuery, setSearchQuery, accounts } = useMail();
  const { openCompose, goToSettings } = useUI();
  const { theme, toggleTheme } = useTheme();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

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
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearchQuery('')}>
            ×
          </button>
        )}
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
        
        <div className="account-switcher">
          <button className="account-btn" onClick={() => setShowAccountMenu(!showAccountMenu)}>
            <Avatar fallback={currentUser.name} size="sm" />
            <ChevronDown size={14} className="account-chevron" />
          </button>
          {showAccountMenu && (
            <div className="account-menu">
              <div className="account-menu-header">
                <span className="account-menu-email">{currentUser.email}</span>
              </div>
              <div className="account-menu-items">
                <button className="account-menu-item active">
                  <div className="account-menu-avatar" style={{ backgroundColor: '#4361ee' }}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="account-menu-info">
                    <span className="account-menu-name">{currentUser.name}</span>
                    <span className="account-menu-email-small">{currentUser.email}</span>
                  </div>
                </button>
              </div>
              <div className="account-menu-footer">
                <button className="account-add-btn">
                  <Plus size={16} />
                  Add account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
