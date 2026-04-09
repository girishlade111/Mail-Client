import { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Undo2 } from 'lucide-react';
import './Toast.css';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Toast({ message, type = 'info', onClose, duration = 5000, undoAction }) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type] || Info;

  useEffect(() => {
    if (undoAction) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, undoAction]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const handleUndo = useCallback(() => {
    if (undoAction) {
      undoAction();
      handleClose();
    }
  }, [undoAction]);

  return (
    <div className={`toast toast-${type} ${isExiting ? 'exiting' : ''}`}>
      <Icon size={18} className="toast-icon" />
      <span className="toast-message">{message}</span>
      {undoAction && (
        <button className="toast-undo" onClick={handleUndo}>
          <Undo2 size={14} />
          Undo
        </button>
      )}
      <button className="toast-close" onClick={handleClose}>
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          undoAction={toast.undoAction}
          onClose={() => onRemove(toast.id)}
          duration={toast.undoAction ? 8000 : 5000}
        />
      ))}
    </div>
  );
}