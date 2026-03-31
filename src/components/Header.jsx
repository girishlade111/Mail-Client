import { Search, Bell, Settings, Menu, Sun, Moon, Plus } from 'lucide-react';
import { useMail } from '../context/MailContext';
import { useUI } from '../context/UIContext';
import { Avatar, Button } from './ui';
import './Header.css';

export function Header({ onMenuClick }) {
  const { currentUser, searchQuery, setSearchQuery } = useMail();
  const { openCompose } = useUI();
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
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
        <Button variant="ghost" size="sm" className="icon-btn" title="Settings">
          <Settings size={18} />
        </Button>
        <Avatar fallback={currentUser.name} size="sm" />
      </div>
    </header>
  );
}
