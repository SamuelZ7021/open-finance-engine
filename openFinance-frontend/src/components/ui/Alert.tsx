import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  autoCloseDuration?: number;
}

const Alert: React.FC<AlertProps> = ({ 
  type, 
  title, 
  message, 
  onClose, 
  autoCloseDuration = 5000 
}) => {
  useEffect(() => {
    if (autoCloseDuration > 0) {
      const timer = setTimeout(onClose, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration, onClose]);

  const baseStyles = 'rounded-lg p-4 border flex items-start gap-3 animate-slide-down';
  
  const typeStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900'
  };

  const iconStyles = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    info: 'text-blue-600',
    warning: 'text-amber-600'
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={`w-5 h-5 flex-shrink-0 ${iconStyles.success}`} />;
      case 'error':
        return <XCircle className={`w-5 h-5 flex-shrink-0 ${iconStyles.error}`} />;
      case 'warning':
        return <AlertCircle className={`w-5 h-5 flex-shrink-0 ${iconStyles.warning}`} />;
      case 'info':
      default:
        return <Info className={`w-5 h-5 flex-shrink-0 ${iconStyles.info}`} />;
    }
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      {getIcon()}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-sm mt-1 opacity-90">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Alert;
