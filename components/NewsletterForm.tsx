'use client';

import { useState, type FormEvent } from 'react';

type Props = {
  placeholder: string;
  buttonText: string;
  loadingText: string;
  successText: string;
  errorText: string;
  duplicateText: string;
  rateLimitedText: string;
};

export default function NewsletterForm({
  placeholder,
  buttonText,
  loadingText,
  successText,
  errorText,
  duplicateText,
  rateLimitedText,
}: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage(rateLimitedText);
        } else {
          setErrorMessage(errorText);
        }
        setStatus('error');
        return;
      }

      if (data?.duplicate) {
        setStatus('duplicate');
      } else {
        setStatus('success');
      }
      setEmail('');
    } catch {
      setErrorMessage(errorText);
      setStatus('error');
    }
  }

  if (status === 'success' || status === 'duplicate') {
    return (
      <div className="flex items-center gap-3 rounded-full border border-gold/30 bg-gold/10 px-6 py-4">
        <svg className="h-5 w-5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-cream">{status === 'duplicate' ? duplicateText : successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-full border border-cream/20 bg-noir/60 px-6 py-4 text-sm text-cream placeholder:text-cream/50 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/40"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90 hover:shadow-[0_0_30px_rgba(201,169,98,0.3)] active:scale-95 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {loadingText}
          </span>
        ) : buttonText}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-400 sm:absolute sm:bottom-0 sm:translate-y-full sm:pt-2">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
