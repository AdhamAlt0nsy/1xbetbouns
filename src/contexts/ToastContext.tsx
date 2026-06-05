import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exiting, setExiting] = useState<string[]>([]);

  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setExiting((prev) => [...prev, id]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        setExiting((prev) => prev.filter((eid) => eid !== id));
      }, 200);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setExiting((prev) => [...prev, id]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setExiting((prev) => prev.filter((eid) => eid !== id));
    }, 200);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[3000] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[300px] flex items-center gap-3 px-5 py-4 rounded-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all ${
              exiting.includes(toast.id) ? 'animate-slide-out' : 'animate-slide-in'
            }`}
            style={{ background: '#1A1F3A' }}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-[#00D084] shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-[#FF2B2B] shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#2B6AFF] shrink-0" />}
            <span className="text-white text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
