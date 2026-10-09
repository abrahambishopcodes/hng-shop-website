'use client';

import { useShop } from '@/lib/shop-context';

export default function Toast() {
  const { toast } = useShop();

  return (
    <div
      className={`toast${toast ? ' show' : ''}`}
      id="toast"
      role="status"
      aria-live="polite"
    >
      {toast && (
        <>
          <span>{toast.message}</span>
          {toast.action && (
            <button onClick={toast.action.action}>{toast.action.label}</button>
          )}
        </>
      )}
    </div>
  );
}
