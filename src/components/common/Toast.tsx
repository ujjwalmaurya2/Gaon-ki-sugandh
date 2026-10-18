import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        let bg = 'bg-white border-brand-green text-brand-dark';
        let icon = <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />;

        if (toast.type === 'error') {
          bg = 'bg-red-50 border-red-500 text-red-900';
          icon = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-50 border-brand-yellow text-amber-900';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
        } else if (toast.type === 'info') {
          bg = 'bg-emerald-50 border-emerald-400 text-emerald-950';
          icon = <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-3.5 rounded-xl border shadow-float backdrop-blur-md transition-all animate-fade-in ${bg}`}
          >
            {icon}
            <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
};
