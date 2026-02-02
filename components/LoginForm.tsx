'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const t = useTranslations('Login');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/account';

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isLoadingMagic, setIsLoadingMagic] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setEmailError('');

    if (!email.trim()) {
      setEmailError(t('form.emailRequired'));
      return;
    }
    if (!emailPattern.test(email)) {
      setEmailError(t('form.emailInvalid'));
      return;
    }

    setIsLoadingMagic(true);
    try {
      const result = await signIn('resend', {
        email,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setApiError(t('form.errorGeneric'));
      } else {
        setMagicLinkSent(true);
      }
    } catch {
      setApiError(t('form.errorGeneric'));
    } finally {
      setIsLoadingMagic(false);
    }
  };

  const handleGoogle = async () => {
    setApiError('');
    setIsLoadingGoogle(true);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setApiError(t('form.errorGeneric'));
      setIsLoadingGoogle(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
          <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-ink">{t('magicSent.title')}</h2>
        <p className="mt-2 text-sm text-ink/70">{t('magicSent.description')}</p>
        <p className="mt-4 text-xs text-ink/50">{t('magicSent.hint')}</p>
      </div>
    );
  }

  const inputBase =
    'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition focus:border-gold/70 focus:outline-none';
  const inputError = 'border-rose-400/70 focus:border-rose-300';
  const inputDefault = 'border-ink/20';

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-8 shadow-lg">
      {apiError && (
        <div role="alert" className="mb-6 rounded-2xl border border-rose-400/30 bg-rose-50 p-4 text-sm text-rose-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleMagicLink} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-xs uppercase tracking-[0.3em] text-ink/60"
          >
            {t('form.emailLabel')}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            className={`${inputBase} ${emailError ? inputError : inputDefault}`}
            placeholder={t('form.emailPlaceholder')}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'login-email-error' : undefined}
          />
          {emailError && (
            <p id="login-email-error" className="text-xs text-rose-600">
              {emailError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoadingMagic}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-noir transition hover:bg-gold/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingMagic ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('form.sending')}
            </>
          ) : (
            t('form.magicLinkButton')
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-ink/10" />
        <span className="text-xs uppercase tracking-[0.3em] text-ink/40">{t('form.divider')}</span>
        <div className="h-px flex-1 bg-ink/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoadingGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 px-6 py-3 text-sm text-ink transition hover:border-ink/40 hover:bg-ink/5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoadingGoogle ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        {t('form.googleButton')}
      </button>
    </div>
  );
}
