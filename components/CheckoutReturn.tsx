'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';

type PaymentStatus = 'loading' | 'paid' | 'pending' | 'failed' | 'canceled' | 'expired' | 'error';

export default function CheckoutReturn() {
  const t = useTranslations('Checkout.return');
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);

  const paymentId = searchParams.get('id');

  useEffect(() => {
    if (!paymentId) {
      setStatus('error');
      return;
    }

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/checkout/status?id=${paymentId}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus('error');
          return;
        }

        setStatus(data.status as PaymentStatus);
        setOrderId(data.orderId || null);
      } catch {
        setStatus('error');
      }
    }

    fetchStatus();
  }, [paymentId]);

  // Clear cart when payment is confirmed paid
  useEffect(() => {
    if (status === 'paid' && !cleared) {
      clearCart();
      setCleared(true);
    }
  }, [status, cleared, clearCart]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="mb-6 h-12 w-12 animate-spin text-gold-dark"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p className="text-inkMuted">{t('loading')}</p>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="mx-auto max-w-lg space-y-8 text-center">
        {/* Green checkmark */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-2 ring-green-500/30">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t('paidTitle')}</h2>
          <p className="text-inkMuted">{t('paidDescription')}</p>
        </div>

        {orderId && (
          <div className="rounded-xl border border-ink/10 bg-white/50 p-4">
            <p className="text-xs uppercase tracking-widest text-ink/60">{t('orderNumber')}</p>
            <p className="mt-1 font-mono text-lg text-gold-dark">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-noir transition-colors hover:bg-gold/90 active:scale-95"
          >
            {t('ctaHome')}
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-8 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold-dark hover:text-gold-dark active:scale-95"
          >
            {t('ctaShop')}
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="mx-auto max-w-lg space-y-8 text-center">
        {/* Yellow clock */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 ring-2 ring-yellow-500/30">
          <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t('pendingTitle')}</h2>
          <p className="text-inkMuted">{t('pendingDescription')}</p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-noir transition-colors hover:bg-gold/90 active:scale-95"
        >
          {t('ctaHome')}
        </Link>
      </div>
    );
  }

  // Failed, canceled, expired, error
  return (
    <div className="mx-auto max-w-lg space-y-8 text-center">
      {/* Red X */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 ring-2 ring-rose-500/30">
        <svg className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">{t('failedTitle')}</h2>
        <p className="text-inkMuted">{t('failedDescription')}</p>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-noir transition-colors hover:bg-gold/90 active:scale-95"
        >
          {t('ctaRetry')}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-8 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold-dark hover:text-gold-dark active:scale-95"
        >
          {t('ctaHome')}
        </Link>
      </div>
    </div>
  );
}
