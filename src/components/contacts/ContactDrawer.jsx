import { X, Star, Mail, Phone, Building, Calendar, Tag, Edit, Trash2, Clock, FileText, MessageSquare } from 'lucide-react';
import { useMemo } from 'react';
import { useMail } from '../../context/MailContext';
import { useUI } from '../../context/UIContext';
import './ContactDrawer.css';

export function ContactDrawer({ contact, onClose }) {
  const { allEmails, toggleContactFavorite, updateContact, addTagToContact, removeTagFromContact } = useMail();
  const { openCompose, addToast } = useUI();

  const recentEmails = useMemo(() => {
    return allEmails
      .filter(e => 
        e.from.email.toLowerCase() === contact.email.toLowerCase() ||
        e.to.some(t => t.email.toLowerCase() === contact.email.toLowerCase())
      )
      .slice(0, 5);
  }, [allEmails, contact.email]);

  const handleCompose = () => {
    openCompose({ to: [{ name: contact.name, email: contact.email }] });
  };

  const handleToggleFavorite = () => {
    toggleContactFavorite(contact.id);
    addToast(contact.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="contact-drawer">
      <div className="drawer-header">
        <h3>Contact</h3>
        <button className="drawer-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="drawer-content">
        <div className="contact-profile">
          <div className="contact-avatar-large">
            {contact.name.charAt(0)}
          </div>
          <div className="contact-profile-info">
            <h2>{contact.name}</h2>
            <span className="contact-role">{contact.role} at {contact.organization}</span>
          </div>
        </div>
        
        <div className="contact-actions">
          <button className="action-btn primary" onClick={handleCompose}>
            <Mail size={16} /> Compose
          </button>
          <button className="action-btn" onClick={handleToggleFavorite}>
            <Star size={16} fill={contact.isFavorite ? '#eab308' : 'none'} />
            {contact.isFavorite ? 'Favorite' : 'Add to favorites'}
          </button>
        </div>
        
        <div className="contact-details">
          <div className="detail-item">
            <Mail size={16} />
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
          
          {contact.phone && (
            <div className="detail-item">
              <Phone size={16} />
              <div className="detail-content">
                <span className="detail-label">Phone</span>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
            </div>
          )}
          
          <div className="detail-item">
            <Building size={16} />
            <div className="detail-content">
              <span className="detail-label">Organization</span>
              <span>{contact.organization}</span>
            </div>
          </div>
          
          {contact.notes && (
            <div className="detail-item notes">
              <FileText size={16} />
              <div className="detail-content">
                <span className="detail-label">Notes</span>
                <p>{contact.notes}</p>
              </div>
            </div>
          )}
          
          <div className="detail-item">
            <Tag size={16} />
            <div className="detail-content">
              <span className="detail-label">Tags</span>
              <div className="contact-tags-list">
                {contact.tags.map(tag => (
                  <span key={tag} className="contact-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          
          {contact.lastInteraction && (
            <div className="detail-item">
              <Clock size={16} />
              <div className="detail-content">
                <span className="detail-label">Last interaction</span>
                <span>{formatDate(contact.lastInteraction)}</span>
              </div>
            </div>
          )}
        </div>
        
        {recentEmails.length > 0 && (
          <div className="recent-emails">
            <h4>Recent emails</h4>
            <div className="email-list">
              {recentEmails.map(email => (
                <div key={email.id} className="email-item">
                  <div className="email-subject">{email.subject}</div>
                  <div className="email-date">{formatDate(email.date)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}