import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { markAsRead } from '../../store/slices/notificationSlice';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) =>
    state.notifications.items.filter((n) => !n.read).slice(0, 4)
  );

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle size={18} color="var(--color-success)" />;
      case 'ERROR':
        return <AlertCircle size={18} color="var(--color-danger)" />;
      case 'WARNING':
        return <AlertTriangle size={18} color="var(--color-warning)" />;
      default:
        return <Info size={18} color="var(--color-info)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        right: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        zIndex: 9999,
        maxWidth: 380,
      }}
    >
      {notifications.map((item) => (
        <div
          key={item.id}
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--color-bg-card)',
            border: 'var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            color: 'var(--color-text-primary)',
          }}
        >
          <div style={{ flexShrink: 0, marginTop: 2 }}>{getIcon(item.type)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.title}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {item.message}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon sm"
            onClick={() => dispatch(markAsRead(item.id))}
            style={{ flexShrink: 0, padding: 2, margin: -4 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
