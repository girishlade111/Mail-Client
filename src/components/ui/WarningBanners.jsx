import { useState } from 'react';
import { WifiOff, AlertTriangle, X, RefreshCw } from 'lucide-react';
import './WarningBanners.css';

export function SyncWarningBanner({ onRetry }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="warning-banner warning-banner-sync">
      <WifiOff size={18} className="banner-icon" />
      <div className="banner-content">
        <span className="banner-title">You're offline</span>
        <span className="banner-message">Some features may be unavailable until you're back online.</span>
      </div>
      <div className="banner-actions">
        <button className="banner-btn" onClick={onRetry}>
          <RefreshCw size={14} />
          Retry
        </button>
        <button className="banner-dismiss" onClick={() => setDismissed(true)}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function PhishingWarningBanner({ suspiciousLinks = 0 }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || suspiciousLinks === 0) return null;

  return (
    <div className="warning-banner warning-banner-phishing">
      <AlertTriangle size={18} className="banner-icon" />
      <div className="banner-content">
        <span className="banner-title">Suspicious links detected</span>
        <span className="banner-message">{suspiciousLinks} link(s) in this email may be malicious. Be careful before clicking.</span>
      </div>
      <div className="banner-actions">
        <button className="banner-btn" onClick={() => setDismissed(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export function AttachmentWarningBanner({ attachments = [] }) {
  const [dismissed, setDismissed] = useState(false);
  const hasSuspicious = attachments.some(att => 
    att.name?.endsWith('.exe') || 
    att.name?.endsWith('.scr') ||
    att.name?.endsWith('.bat')
  );

  if (dismissed || !hasSuspicious) return null;

  return (
    <div className="warning-banner warning-banner-attachments">
      <AlertTriangle size={18} className="banner-icon" />
      <div className="banner-content">
        <span className="banner-title">Potentially unsafe attachments</span>
        <span className="banner-message">This email contains executable files that could harm your computer.</span>
      </div>
      <div className="banner-actions">
        <button className="banner-btn" onClick={() => setDismissed(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}