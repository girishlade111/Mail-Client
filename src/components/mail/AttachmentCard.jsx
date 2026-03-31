import { Paperclip, Download, Eye, FileText, Image, File, Film, Music, Presentation } from 'lucide-react';
import './AttachmentCard.css';

const fileIcons = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/gif': Image,
  'application/zip': File,
  'application/msword': FileText,
  'application/vnd.ms-excel': Presentation,
  'video/mp4': Film,
  'audio/mpeg': Music,
};

export function AttachmentCard({ attachment, onPreview, onDownload }) {
  const Icon = fileIcons[attachment.type] || File;
  const size = formatFileSize(attachment.size);

  return (
    <div className="attachment-card">
      <div className="attachment-icon">
        <Icon size={24} />
      </div>
      <div className="attachment-info">
        <span className="attachment-name">{attachment.name}</span>
        <span className="attachment-size">{size}</span>
      </div>
      <div className="attachment-actions">
        {onPreview && (
          <button className="attachment-action" onClick={onPreview} title="Preview">
            <Eye size={16} />
          </button>
        )}
        {onDownload && (
          <button className="attachment-action" onClick={onDownload} title="Download">
            <Download size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function AttachmentList({ attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="attachment-list">
      <div className="attachment-list-header">
        <Paperclip size={16} />
        <span>{attachments.length} attachment{attachments.length > 1 ? 's' : ''}</span>
      </div>
      <div className="attachment-list-items">
        {attachments.map((att) => (
          <AttachmentCard key={att.id} attachment={att} />
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}