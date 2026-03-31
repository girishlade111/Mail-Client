import { useMail } from '../../context/MailContext';
import './FilterChips.css';

const categories = [
  { id: 'primary', name: 'Primary', count: 12 },
  { id: 'social', name: 'Social', count: 4 },
  { id: 'updates', name: 'Updates', count: 8 },
  { id: 'promotions', name: 'Promotions', count: 2 },
  { id: 'forums', name: 'Forums', count: 1 },
];

export function FilterChips() {
  const { activeCategory, setActiveCategory, allEmails } = useMail();

  const getCategoryCount = (categoryId) => {
    return allEmails.filter(email => 
      email.folder === 'inbox' && email.category === categoryId
    ).length;
  };

  return (
    <div className="filter-chips">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`filter-chip ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => setActiveCategory(category.id)}
        >
          <span className="chip-name">{category.name}</span>
          <span className="chip-count">{getCategoryCount(category.id)}</span>
        </button>
      ))}
    </div>
  );
}