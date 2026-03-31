import { format } from 'date-fns';
import { Star, Trash2, Reply, Forward, MoreHorizontal, Archive, AlertOctagon } from 'lucide-react';
import { Avatar, Button } from './ui';
import { useMail } from '../context/MailContext';
import './MailDetail.css';

export function MailDetail({ email, onBack }) {
  const { toggleStar, deleteEmail, moveToFolder } = useMail();

  if (!email) {
    return (
      <div className="mail-detail empty">
        <p>Select an email to view</p>
      </div>
    );
  }

  return (
    <div className="mail-detail">
      <div className="mail-detail-header">
        <div className="mail-detail-actions">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="back-btn">
              ← Back
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => moveToFolder(email.id, 'archive')}>
            <Archive size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => moveToFolder(email.id, 'spam')}>
            <AlertOctagon size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteEmail(email.id)}>
            <Trash2 size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => toggleStar(email.id)}>
            <Star size={16} className={email.starred ? 'starred' : ''} />
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal size={16} />
        </Button>
      </div>

      <div className="mail-detail-content">
        <div className="mail-detail-subject">
          <h2>{email.subject}</h2>
        </div>

        <div className="mail-detail-meta">
          <Avatar fallback={email.from.name} size="lg" />
          <div className="meta-info">
            <div className="meta-from">
              <span className="from-name">{email.from.name}</span>
              <span className="from-email">&lt;{email.from.email}&gt;</span>
            </div>
            <div className="meta-date">
              To: {email.to.map((t) => t.name).join(', ')} • {format(new Date(email.date), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </div>

        <div className="mail-detail-body">
          <pre>{email.body}</pre>
        </div>

        <div className="mail-detail-reply">
          <Button variant="secondary">
            <Reply size={16} />
            Reply
          </Button>
          <Button variant="secondary">
            <Forward size={16} />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}