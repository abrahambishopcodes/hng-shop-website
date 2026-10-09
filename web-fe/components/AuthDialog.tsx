'use client';

import { useEffect, useRef, useState } from 'react';
import { useShop } from '@/lib/shop-context';
import { Icon } from './Icons';

export default function AuthDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showToast } = useShop();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = () => onClose();
    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [onClose]);

  function handleGoogleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Taking you to Google…';
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    window.location.assign(`${apiBase}/auth/google`);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter an email address like name@example.com.');
      return;
    }
    setError('');
    onClose();
    showToast('Email sign-in is a demo — use Google to sign in for real.');
  }

  return (
    <dialog
      ref={dialogRef}
      className="auth-panel"
      id="auth-panel"
      aria-labelledby="auth-title"
      onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
    >
      <button className="icon-button auth-close" aria-label="Close sign in" onClick={onClose}>
        <Icon name="close" />
      </button>

      <div className="auth-sign">
        <p className="auth-sign-text">
          Your bag,
          <br />
          on every
          <br />
          device.
        </p>
      </div>

      <div className="auth-form">
        <h2 id="auth-title">Sign in</h2>
        <p className="auth-subtitle">
          Save your favourite pieces and pick up your bag where you left it.
        </p>

        <button className="google-button" id="google-signin" onClick={handleGoogleSignIn}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.35 12.28c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.52h3.14c1.84-1.69 2.91-4.18 2.91-7.29Z" />
            <path fill="#34A853" d="M12 21.8c2.63 0 4.84-.87 6.45-2.23l-3.14-2.52c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.6A9.75 9.75 0 0 0 12 21.8Z" />
            <path fill="#FBBC05" d="M6.54 13.95a5.86 5.86 0 0 1 0-3.9v-2.6H3.3a9.73 9.73 0 0 0 0 9.1l3.24-2.6Z" />
            <path fill="#EA4335" d="M12 6.02c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.08 14.63 2.2 12 2.2a9.75 9.75 0 0 0-8.7 5.25l3.24 2.6C7.31 7.74 9.46 6.02 12 6.02Z" />
          </svg>
          Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form className="email-form" id="email-form" noValidate onSubmit={handleEmailSubmit}>
          <label htmlFor="email-input">Email address</label>
          <input
            id="email-input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby="email-error"
            aria-invalid={error ? true : undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="field-error" id="email-error" aria-live="polite">
            {error}
          </p>
          <button className="button button-board button-wide" type="submit">
            Continue with email <Icon name="arrow" />
          </button>
        </form>

        <p className="terms">By continuing, you agree to our Terms and Privacy Policy.</p>
      </div>
    </dialog>
  );
}
