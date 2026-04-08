import { useState } from 'react';
import { Bell, Settings, Menu, Sun, Moon, Plus, ChevronDown } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Button } from './ui';
import { SearchBar } from './search/SearchBar';
import './Header.css';

export function Header({ onMenuClick }) {
  const { searchQuery, setSearchQuery, isSearchActive, setIsSearchActive } = useMail();
  const { openCompose, goToSettings } = useUI();
  const { theme, toggleTheme } = useTheme();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleSearch = (query) => {
    if (query) {
      setIsSearchActive(true);
    }
  };

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
        
        <div className="account-switcher">
          <button className="account-btn" onClick={() => setShowAccountMenu(!showAccountMenu)}>
            <Avatar fallback="AM" size="sm" />
            <ChevronDown size={14} className="account-chevron" />
          </button>
          {showAccountMenu && (
            <div className="account-menu">
              <div className="account-menu-header">
                <span className="account-menu-email">alex@flowmail.com</span>
              </div>
              <div className="account-menu-items">
                <button className="account-menu-item active">
                  <div className="account-menu-avatar" style={{ backgroundColor: '#4361ee' }}>
                    AM
                  </div>
                  <div className="account-menu-info">
                    <span className="account-menu-name">Alex Morgan</span>
                    <span className="account-menu-email-small">alex@flowmail.com</span>
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