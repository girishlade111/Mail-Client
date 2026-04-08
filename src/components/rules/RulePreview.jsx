import { X, Mail } from 'lucide-react';
import { useMail } from '../../context/MailContext';
import { Modal } from '../ui/Modal';
import { MailRow } from '../MailRow';
import './RulePreview.css';

export function RulePreview({ ruleId, onClose }) {
  const { rules, getMatchingEmailsForRule } = useMail();
  
  const rule = rules.find(r => r.id === ruleId);
  const matchingEmails = getMatchingEmailsForRule(ruleId);

  if (!rule) return null;

  return (
    <Modal open={true} onClose={onClose} title={`Preview: ${rule.name}`} size="xl">
      <div className="rule-preview">
        <div className="preview-header">
          <span className="preview-count">{matchingEmails.length} matching email{matchingEmails.length !== 1 ? 's' : ''}</span>
        </div>

        {matchingEmails.length === 0 ? (
          <div className="preview-empty">
            <Mail size={48} />
            <h4>No matching emails</h4>
            <p>No emails currently match this rule's conditions</p>
          </div>
        ) : (
          <div className="preview-list">
            {matchingEmails.slice(0, 10).map(email => (
              <MailRow
                key={email.id}
                email={email}
                isSelected={false}
                onClick={() => {}}
              />
            ))}
            
            {matchingEmails.length > 10 && (
              <div className="preview-more">
                +{matchingEmails.length - 10} more emails
              </div>
            )}
          </div>
        )}

        <div className="preview-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}