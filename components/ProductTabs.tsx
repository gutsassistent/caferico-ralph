'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  description: string;
  notes: string;
  origin: string;
  isCoffee: boolean;
};

const tabs = ['description', 'tasting', 'brewing', 'origin'] as const;
type Tab = (typeof tabs)[number];

export default function ProductTabs({ description, notes, origin, isCoffee }: Props) {
  const t = useTranslations('Product.tabs');
  const [active, setActive] = useState<Tab>('description');

  if (!isCoffee) {
    return (
      <div className="rounded-2xl border border-cream/10 bg-surface-darkest/80 p-6 sm:p-8">
        <div
          className="prose prose-sm prose-invert max-w-none text-cream/70"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    );
  }

  const tastingNotes = notes
    ? notes.split(',').map((n) => n.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-cream/10 bg-surface-darkest/80 p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
              active === tab
                ? 'bg-gold/20 text-gold shadow-sm'
                : 'text-cream/50 hover:text-cream/80'
            }`}
          >
            {t(`${tab}.title`)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-2xl border border-cream/10 bg-surface-darkest/80 p-6 sm:p-8">
        {active === 'description' && (
          <div className="space-y-4">
            <div
              className="prose prose-sm prose-invert max-w-none text-cream/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {active === 'tasting' && (
          <div className="space-y-6">
            <p className="text-sm text-cream/60">{t('tasting.intro')}</p>
            <div className="flex flex-wrap gap-2">
              {tastingNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold"
                >
                  {note}
                </span>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('tasting.bodyLabel')}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i <= 3 ? 'bg-gold' : 'bg-cream/15'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('tasting.acidityLabel')}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i <= 4 ? 'bg-gold' : 'bg-cream/15'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-cream/60">
                  {t('tasting.sweetnessLabel')}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full ${
                        i <= 3 ? 'bg-gold' : 'bg-cream/15'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {active === 'brewing' && (
          <div className="space-y-6">
            <p className="text-sm text-cream/60">{t('brewing.intro')}</p>
            <div className="grid gap-6 sm:grid-cols-3">
              {(['filter', 'espresso', 'frenchpress'] as const).map((method) => (
                <div
                  key={method}
                  className="rounded-xl border border-cream/10 bg-cream/[0.03] p-5 space-y-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    {method === 'filter' && (
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 11.314l.707.707M5.636 18.364l.707-.707m11.314-11.314l.707-.707" />
                      </svg>
                    )}
                    {method === 'espresso' && (
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.482 4.446A2.25 2.25 0 0 1 15.38 21H8.62a2.25 2.25 0 0 1-2.137-1.554L5 14.5m14 0H5" />
                      </svg>
                    )}
                    {method === 'frenchpress' && (
                      <svg className="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-cream">
                    {t(`brewing.${method}.title`)}
                  </h4>
                  <p className="text-xs text-cream/50 leading-relaxed">
                    {t(`brewing.${method}.grind`)}
                  </p>
                  <p className="text-xs text-cream/50 leading-relaxed">
                    {t(`brewing.${method}.ratio`)}
                  </p>
                  <p className="text-xs text-cream/50 leading-relaxed">
                    {t(`brewing.${method}.temp`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'origin' && (
          <div className="space-y-6">
            <p className="text-sm text-cream/60">{t('origin.intro')}</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                { label: t('origin.regionLabel'), value: origin || 'Honduras, Marcala' },
                { label: t('origin.altitudeLabel'), value: '1.350 – 1.850m' },
                { label: t('origin.cooperativeLabel'), value: 'COMBRIFOL' },
                { label: t('origin.familiesLabel'), value: '193' },
                { label: t('origin.varietiesLabel'), value: 'Catuaí, Bourbon, Típica, Pache, Paca' },
                { label: t('origin.certLabel'), value: 'EU Bio (BE-BIO-02), Mayacert, Fair Trade' },
              ].map((item) => (
                <div key={item.label} className="space-y-1 rounded-xl border border-cream/10 bg-cream/[0.03] p-4">
                  <dt className="text-xs uppercase tracking-[0.3em] text-cream/60">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-cream">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex gap-4">
              <div className="rounded-lg border border-gold/20 bg-gold/10 px-4 py-2 text-center">
                <p className="text-lg font-serif text-gold">84</p>
                <p className="text-xs uppercase tracking-[0.2em] text-cream/60">SCAA</p>
              </div>
              <div className="rounded-lg border border-gold/20 bg-gold/10 px-4 py-2 text-center">
                <p className="text-lg font-serif text-gold">86</p>
                <p className="text-xs uppercase tracking-[0.2em] text-cream/60">Marcala</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
