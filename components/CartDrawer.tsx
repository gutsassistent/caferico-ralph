'use client';

import { useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useCart } from '@/components/CartProvider';
import { isCoffee } from '@/types/product';

export default function CartDrawer() {
  const t = useTranslations('Cart');
  const productT = useTranslations('Product');
  const shopT = useTranslations('Shop');
  const locale = useLocale();
  const { items, totalItems, subtotal, isOpen, closeCart, updateItemQuantity, removeItem } =
    useCart();

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR'
      }),
    [locale]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeCart, isOpen]);

  const hasItems = items.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('title')}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-cream/10 bg-[#120907] shadow-[0_30px_80px_rgba(0,0,0,0.55)] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between border-b border-cream/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('eyebrow')}</p>
            <h2 className="mt-2 font-serif text-2xl text-cream">{t('title')}</h2>
            <p className="mt-1 text-xs text-cream/50">{t('itemsCount', { count: totalItems })}</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition hover:border-gold/60 hover:text-gold"
          >
            <span className="sr-only">{t('close')}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M6 6l12 12" strokeLinecap="round" />
              <path d="M18 6l-12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {!hasItems ? (
            <div className="rounded-3xl border border-cream/10 bg-[#140b08] p-6 text-center shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
              <div className="mx-auto mb-5 h-16 w-16 rounded-full border border-gold/40 bg-noir/70 text-gold" />
              <p className="text-xs uppercase tracking-[0.3em] text-gold/70">{t('emptyEyebrow')}</p>
              <h3 className="mt-2 font-serif text-xl text-cream">{t('emptyTitle')}</h3>
              <p className="mt-3 text-sm text-cream/60">{t('emptyDescription')}</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 inline-flex items-center justify-center rounded-full border border-gold/60 px-5 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('emptyCta')}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.grind}-${item.weight}`}
                className="border-b border-cream/10 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <div className="relative h-24 w-20 overflow-hidden rounded-2xl border border-cream/10 bg-gradient-to-br from-espresso via-[#1d120d] to-noir">
                    <div className="absolute inset-0 bg-coffee-grain opacity-40" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,165,116,0.25),_transparent_60%)]" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
                          {shopT(`collections.${item.collection}`)}
                        </p>
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="mt-1 block font-serif text-lg text-cream transition hover:text-gold"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeItem({ id: item.id, grind: item.grind, weight: item.weight })
                        }
                        className="text-xs uppercase tracking-[0.3em] text-cream/40 transition hover:text-gold"
                      >
                        {t('remove')}
                      </button>
                    </div>
                    {isCoffee(item.collection) && item.grind && item.weight && (
                      <div className="flex flex-wrap gap-3 text-xs text-cream/60">
                        <span>
                          {productT('variants.grindLabel')}:{' '}
                          {productT(`variants.grind.${item.grind}`)}
                        </span>
                        <span>
                          {productT('variants.weightLabel')}:{' '}
                          {productT(`variants.weight.${item.weight}`)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border border-cream/10 bg-noir/60">
                        <button
                          type="button"
                          onClick={() =>
                            updateItemQuantity(
                              { id: item.id, grind: item.grind, weight: item.weight },
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          aria-label={t('quantityDecrease')}
                          className="px-3 py-1 text-sm text-cream/70 transition hover:text-cream"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-xs text-cream">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateItemQuantity(
                              { id: item.id, grind: item.grind, weight: item.weight },
                              item.quantity + 1
                            )
                          }
                          aria-label={t('quantityIncrease')}
                          className="px-3 py-1 text-sm text-cream/70 transition hover:text-cream"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gold">
                        {priceFormatter.format(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-cream/10 px-6 py-5">
          {hasItems ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-cream/70">
                <span>{t('subtotalLabel')}</span>
                <span className="text-cream">{priceFormatter.format(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-gold">
                <span>{t('totalLabel')}</span>
                <span>{priceFormatter.format(subtotal)}</span>
              </div>
              <p className="text-xs text-cream/40">{t('shippingNote')}</p>
              <button
                type="button"
                className="w-full rounded-full border border-gold/70 px-5 py-3 text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold hover:text-noir"
              >
                {t('checkout')}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs uppercase tracking-[0.3em] text-cream/40">
              {t('emptyFooter')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
