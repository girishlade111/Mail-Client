import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import { Eye, EyeOff, Star, Zap, Settings } from 'lucide-react';
import './FilterChips.css';

const categories = [
  { id: 'all', name: 'All', icon: null },
  { id: 'primary', name: 'Primary', icon: null },
  { id: 'social', name: 'Social', icon: null },
  { id: 'updates', name: 'Updates', icon: null },
  { id: 'promotions', name: 'Promotions', icon: null },
  { id: 'forums', name: 'Forums', icon: null },
  { id: 'team', name: 'Team', icon: null },
];

export function FilterChips() {
  const { activeCategory, setActiveCategory, allEmails, categories: ctxCategories, focusedInboxEnabled, toggleFocusedInbox, updateCategory } = useMail();
  const { addToast } = useUI();

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') {
      return allEmails.filter(email => email.folder === 'inbox').length;
    }
    return allEmails.filter(email => 
      email.folder === 'inbox' && email.category === categoryId
    ).length;
  };

  const getUnreadCount = (categoryId) => {
    if (categoryId === 'all') {
      return allEmails.filter(email => email.folder === 'inbox' && !email.read).length;
    }
    return allEmails.filter(email => 
      email.folder === 'inbox' && email.category === categoryId && !email.read
    ).length;
  };

  const visibleCategories = ctxCategories.filter(c => c.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="filter-chips">
      {focusedInboxEnabled && (
        <button
          className="filter-chip focused-toggle"
          onClick={toggleFocusedInbox}
          title="Toggle Focused inbox"
        >
          <Zap size={14} />
          Focused
        </button>
      )}
      
      <button
        key="all"
        className={`filter-chip ${activeCategory === null ? 'active' : ''}`}
        onClick={() => {
          setActiveCategory(null);
          addToast('Showing all messages');
        }}
      >
        <span className="chip-name">All</span>
        <span className="chip-count">{getCategoryCount('all')}</span>
        {getUnreadCount('all') > 0 && (
          <span className="chip-unread">{getUnreadCount('all')}</span>
        )}
      </button>
      
      {visibleCategories.map((category) => {
        const count = getCategoryCount(category.id);
        const unread = getUnreadCount(category.id);
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            className={`filter-chip ${isActive ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category.id === activeCategory ? null : category.id);
              if (isActive) {
                addToast('Showing all messages');
              } else {
                addToast(`Filtered by ${category.name}`);
              }
            }}
            title={category.name}
          >
            {category.focused && (
              <Star size={10} className="chip-star" fill="#eab308" />
            )}
            <span className="chip-name">{category.name}</span>
            {count > 0 && <span className="chip-count">{count}</span>}
            {unread > 0 && (
              <span className="chip-unread">{unread}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CategoryManager() {
  const { categories, updateCategory, toggleFocusedInbox, focusedInboxEnabled } = useMail();
  const { addToast } = useUI();

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const handleToggleVisibility = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
      updateCategory(categoryId, { visible: !cat.visible });
      addToast(`${cat.name} ${cat.visible ? 'hidden' : 'shown'}`);
    }
  };

  const handleToggleFocused = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    if (cat) {
      updateCategory(categoryId, { focused: !cat.focused });
      addToast(`${cat.name} ${cat.focused ? 'removed from' : 'added to'} Focused`);
    }
  };

  return (
    <div className="category-manager">
      <div className="category-header">
        <h3>Categories</h3>
        <div className="category-options">
          <label className="focused-toggle">
            <input 
              type="checkbox" 
              checked={focusedInboxEnabled}
              onChange={toggleFocusedInbox}
            />
            <Zap size={14} />
            Focused inbox
          </label>
        </div>
      </div>

      <div className="category-list">
        {sortedCategories.map(category => (
          <div key={category.id} className="category-item">
            <div className="category-color" style={{ backgroundColor: getCategoryColor(category.id) }} />
            
            <div className="category-info">
              <span className="category-name">{category.name}</span>
              <div className="category-toggles">
                <button 
                  className={`cat-toggle ${category.focused ? 'active' : ''}`}
                  onClick={() => handleToggleFocused(category.id)}
                  title={category.focused ? 'Remove from Focused' : 'Add to Focused'}
                >
                  <Star size={12} fill={category.focused ? '#eab308' : 'none'} />
                </button>
                <button 
                  className={`cat-toggle ${category.visible ? '' : 'hidden'}`}
                  onClick={() => handleToggleVisibility(category.id)}
                  title={category.visible ? 'Hide' : 'Show'}
                >
                  {category.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCategoryColor(categoryId) {
  const colors = {
    primary: '#4361ee',
    social: '#8b5cf6',
    updates: '#22c55e',
    promotions: '#f59e0b',
    forums: '#06b6d4',
    team: '#ec4899',
  };
  return colors[categoryId] || '#6b7280';
}

export function EmptyInbox({ category }) {
  const getMessage = () => {
    switch (category) {
      case 'social':
        return { title: 'No social messages', subtitle: 'Messages from social networks will appear here' };
      case 'updates':
        return { title: 'No updates', subtitle: 'Receipts, confirmations, and bills will appear here' };
      case 'promotions':
        return { title: 'No promotions', subtitle: 'Deals and offers will appear here' };
      case 'forums':
        return { title: 'No forum messages', subtitle: 'Messages from forums will appear here' };
      case 'team':
        return { title: 'No team messages', subtitle: 'Messages from your team will appear here' };
      default:
        return { title: 'No messages', subtitle: 'Your inbox is empty' };
    }
  };

  const { title, subtitle } = getMessage();

  return (
    <div className="empty-inbox">
      <div className="empty-icon">📭</div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading messages...</p>
    </div>
  );
}

export function SyncingState() {
  return (
    <div className="syncing-state">
      <div className="syncing-icon">🔄</div>
      <p>Syncing your messages...</p>
    </div>
  );
}