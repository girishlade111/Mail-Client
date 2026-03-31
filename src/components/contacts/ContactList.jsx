import { useState } from 'react';
import { Plus, Star, Search, Mail, Phone, Building, MoreHorizontal } from 'lucide-react';
import { Avatar } from '../ui';
import { contacts } from '../../data/mock';
import './ContactList.css';

export function ContactList({ onContactClick, onAddContact }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'favorites') return matchesSearch && contact.isFavorite;
    if (filter === 'team') return matchesSearch && contact.tags.includes('team');
    if (filter === 'clients') return matchesSearch && contact.tags.includes('client');
    return matchesSearch;
  });

  const favorites = filteredContacts.filter(c => c.isFavorite);
  const others = filteredContacts.filter(c => !c.isFavorite);

  return (
    <div className="contacts-layout">
      <div className="contacts-header">
        <div className="contacts-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search contacts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-contact-btn" onClick={onAddContact}>
          <Plus size={18} />
          Add contact
        </button>
      </div>

      <div className="contacts-filter">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
          onClick={() => setFilter('favorites')}
        >
          <Star size={14} /> Favorites
        </button>
        <button 
          className={`filter-btn ${filter === 'team' ? 'active' : ''}`}
          onClick={() => setFilter('team')}
        >
          Team
        </button>
        <button 
          className={`filter-btn ${filter === 'clients' ? 'active' : ''}`}
          onClick={() => setFilter('clients')}
        >
          Clients
        </button>
      </div>

      <div className="contacts-list">
        {favorites.length > 0 && (
          <div className="contacts-section">
            <div className="contacts-section-header">Favorites</div>
            {favorites.map(contact => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                onClick={() => onContactClick?.(contact)}
              />
            ))}
          </div>
        )}

        <div className="contacts-section">
          {favorites.length > 0 && (
            <div className="contacts-section-header">All Contacts</div>
          )}
          {others.map(contact => (
            <ContactCard 
              key={contact.id} 
              contact={contact} 
              onClick={() => onContactClick?.(contact)}
            />
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="empty-contacts">
            <p>No contacts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ContactCard({ contact, onClick }) {
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="contact-card" onClick={onClick}>
      <Avatar fallback={initials} size="md" />
      <div className="contact-info">
        <div className="contact-name">
          {contact.name}
          {contact.isFavorite && <Star size={14} className="favorite-star" />}
        </div>
        <div className="contact-email">{contact.email}</div>
        {contact.organization && (
          <div className="contact-org">{contact.organization}</div>
        )}
      </div>
      <div className="contact-tags">
        {contact.tags.map(tag => (
          <span key={tag} className={`contact-tag tag-${tag}`}>{tag}</span>
        ))}
      </div>
    </div>
  );
}