'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const tid = ++id;
    // Errors persist until manually dismissed (duration = 0 means no auto-dismiss)
    const autoDismissDuration = type === 'error' ? 0 : duration;
    setToasts(prev => [...prev, { id: tid, message, type, exiting: false }]);
    if (autoDismissDuration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === tid ? { ...t, exiting: true } : t));
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== tid));
        }, 260);
      }, autoDismissDuration);
    }
    return tid;
  }, []);

  const dismiss = useCallback(tid => {
    setToasts(prev => prev.map(t => t.id === tid ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 260);
  }, []);

  const toast = {
    success: (msg, dur) => add(msg, 'success', dur),
    error:   (msg, dur) => add(msg, 'error',   dur),
    info:    (msg, dur) => add(msg, 'info',     dur),
  };

  const ICONS = {
    success: <CheckCircle2 size={18} strokeWidth={2} style={{ color: '#00875A', flexShrink: 0 }} />,
    error:   <AlertCircle  size={18} strokeWidth={2} style={{ color: '#C0392B', flexShrink: 0 }} />,
    info:    <Info         size={18} strokeWidth={2} style={{ color: '#6C5CE7', flexShrink: 0 }} />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Render toasts */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast toast-${t.type}${t.exiting ? ' exiting' : ''}`}>
              {ICONS[t.type]}
              <span className="flex-1 text-sm">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-[var(--bg)] transition-colors shrink-0"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
