import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  notice: { message: string; type: 'success' | 'error' | 'info' } | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notice, onClose }) => {
  if (!notice) return null;

  const getStyle = () => {
    switch (notice.type) {
      case 'success':
        return 'bg-[#171A21] border-[#84CC16] text-[#84CC16] glow-lime';
      case 'error':
        return 'bg-[#171A21] border-red-500 text-red-400';
      default:
        return 'bg-[#171A21] border-[#38BDF8] text-[#38BDF8]';
    }
  };

  const getIcon = () => {
    switch (notice.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 flex-shrink-0" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-200">
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-2xl ${getStyle()}`}>
        <div className="flex items-center space-x-3 text-xs font-semibold text-[#F8FAFC]">
          {getIcon()}
          <span>{notice.message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
