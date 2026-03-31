import { Search, Bell, Settings, Menu } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { Avatar, Button } from './ui';
import './Header.css';

export function Header({ onMenuClick }) {
  const { currentUser, searchQuery, setSearchQuery } = useMail();

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
      </div>

      <div className="header-right">
        <Button variant="ghost" size="sm" className="icon-btn">
          <Bell size={18} />
        </Button>
        <Button variant="ghost" size="sm" className="icon-btn">
          <Settings size={18} />
        </Button>
        <Avatar fallback={currentUser.name} size="sm" />
      </div>
    </header>
  );
}