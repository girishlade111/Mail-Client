import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
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
  const { activeCategory, setActiveCategory, allEmails } = useMail();
  const { addToast } = useUI();

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') {
      return allEmails.filter(email => email.folder === 'inbox').length;
    }
    return allEmails.filter(email => 
      email.folder === 'inbox' && email.category === categoryId
    ).length;
  };

  return (
    <div className="filter-chips">
      {categories.map((category) => {
        const count = getCategoryCount(category.id);
        return (
          <button
            key={category.id}
            className={`filter-chip ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category.id === 'all' ? null : category.id);
              if (category.id === 'all') {
                addToast('Showing all messages');
              } else {
                addToast(`Filtered by ${category.name}`);
              }
            }}
          >
            <span className="chip-name">{category.name}</span>
            {count > 0 && <span className="chip-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
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